'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import CheckboxWithLabel from '@/components/form/CheckboxWithLabel'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  StickyFormLabel,
  stickyFormLabelClassName
} from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import LoadingIndicator from '@/components/LoadingIndicator'
import DeleteMonitoringForm from '@/components/MonitoringForm/DeleteMonitoringForm'
import MonitoringDateField from '@/components/MonitoringForm/MonitoringDateField'
import QuestionNav from '@/components/QuestionNav'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { unitOptions } from '@/data/ecologicalOptions'
import { monitoringIndicators } from '@/data/monitoringIndicators'
import { ecologicalStatusOutcomes as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import language from '@/language'
import { findRegistationDataItem } from '@/library/findDataItems'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import { useInitializeQuestionMappedFormMonitors } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useMonitoringFormId from '@/library/useMonitoringFormId'
import useSiteInfo from '@/library/useSiteInfo'
import { siteQueries } from '@/queries/sites'
import type { RegistrationAnswer } from '@/types/api'

import EcologicalOutcomesRow from './EcologicalOutcomesRow'

type SelectQuestion =
  | 'mangroveAreaIncrease'
  | 'mangroveConditionImprovement'
  | 'naturalRegenerationOnSite'
  | 'achievementOfEcologicalAims'

type MultiselectAnswer = { selectedValues?: string[]; otherValue?: string }
type IndicatorGroup = (typeof monitoringIndicators)[number]
type Indicator = IndicatorGroup['indicators'][number]

const stakeholderTypeOptions = getOptionsValuesAndLabels(['Paid', 'Voluntary'])
const unitSelectOptions = getOptionsValuesAndLabels(unitOptions)
const nestedLabel1 = 'mt-4 block font-bold uppercase'

const selectQuestion = (name: SelectQuestion) => (
  <FormQuestionDiv>
    <FormSelect<RegistrationFormValues, SelectQuestion>
      name={name}
      label={questions[name].question}
      labelClassName={stickyFormLabelClassName}
      placeholder={language.form.selectLabel}
      options={getOptionsValuesAndLabels(questions[name].options)}
    />
  </FormQuestionDiv>
)

// An outcome can be linked to the ecological aims of 3.1 (with its "other").
const aimsFromAnswers = (answers: RegistrationAnswer[] | undefined) => {
  const aims = findRegistationDataItem(answers, '3.1') as MultiselectAnswer | undefined
  if (!aims?.selectedValues?.length) return []
  return [...aims.selectedValues, ...(aims.otherValue ? [aims.otherValue] : [])]
}

// Older answers may hold the misspelt `indictor`.
const isSameIndicator = (
  row: { indicator?: string; indictor?: string; metric?: string },
  { indicator, metric }: Indicator
) => (row.indicator ?? row.indictor) === indicator && row.metric === metric

function EcologicalStatusAndOutcomesForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()
  const monitoringFormId = useMonitoringFormId()

  const {
    fields: indicatorFields,
    append: indicatorAppend,
    remove: indicatorRemove,
    replace: indicatorReplace
  } = useFieldArray({ name: 'monitoringIndicators', control })
  const {
    fields: stakeholderFields,
    append: stakeholderAppend,
    remove: stakeholderRemove,
    replace: stakeholderReplace
  } = useFieldArray({ name: 'ecologicalMonitoringStakeholders', control })

  const mangroveAreaIncrease = useWatch({ control, name: 'mangroveAreaIncrease' })
  const prePost = useWatch({ control, name: 'preAndPostRestorationActivities' })

  const registrationQuery = useQuery({ ...siteQueries.registration(siteId), enabled: !!siteId })
  useLoadErrorToast(registrationQuery.error)
  const aims = useMemo(() => aimsFromAnswers(registrationQuery.data), [registrationQuery.data])
  const biophysicalInterventions = findRegistationDataItem(registrationQuery.data, '6.2') as
    | MultiselectAnswer
    | undefined
  const showSurvival = !!biophysicalInterventions?.selectedValues?.includes('Planting')

  const onLoaded = useCallback(
    (_monitor: unknown, sectionData: Record<string, unknown>) => {
      const sectionValues = sectionData as Partial<RegistrationFormValues>
      // Load the rows through the field arrays so their `fields` match the saved answers.
      queueMicrotask(() => {
        indicatorReplace(sectionValues.monitoringIndicators ?? [])
        stakeholderReplace(sectionValues.ecologicalMonitoringStakeholders ?? [])
      })
    },
    [indicatorReplace, stakeholderReplace]
  )

  const { isLoading } = useInitializeQuestionMappedFormMonitors({
    key: 'ecologicalStatusAndOutcomes',
    siteId,
    monitorId: monitoringFormId,
    form,
    successCallback: onLoaded
  })

  const toggleStakeholder = (stakeholder: string, checked: boolean) => {
    const index = stakeholderFields.findIndex((f) => f.stakeholder === stakeholder)
    if (checked && index === -1) stakeholderAppend({ stakeholder, stakeholderType: '' })
    if (!checked && index !== -1) stakeholderRemove(index)
  }

  const toggleIndicator = (group: IndicatorGroup, indicator: Indicator, checked: boolean) => {
    const index = indicatorFields.findIndex((f) => isSameIndicator(f, indicator))
    if (checked && index === -1) {
      indicatorAppend({
        mainLabel: group.category,
        secondaryLabel: group.sub_category,
        indicator: indicator.indicator,
        metric: indicator.metric,
        measurement: '',
        unit: '',
        comparison: '',
        measurementComparison: '',
        linkedAims: []
      })
    }
    if (!checked && index !== -1) indicatorRemove(index)
  }

  if (isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.ecologicalStatusOutcomes}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='ecological-status-and-outcomes'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <MonitoringDateField
            name='monitoringStartDate'
            question={questions.dateOfEcologicalMonitoring.question}
            label='Monitoring start date'
            labelClassName={stickyFormLabelClassName}
            required
          />
          <div className='mt-4'>
            <MonitoringDateField name='monitoringEndDate' label='Monitoring end date' />
          </div>
        </FormQuestionDiv>

        <FormQuestionDiv>
          <StickyFormLabel id='ecological-monitoring-stakeholders-label'>
            {questions.ecologicalMonitoringStakeholders.question}
          </StickyFormLabel>
          <ul
            aria-labelledby='ecological-monitoring-stakeholders-label'
            className='m-0 list-none p-0'>
            {questions.ecologicalMonitoringStakeholders.options.map((stakeholder) => {
              const index = stakeholderFields.findIndex((f) => f.stakeholder === stakeholder)
              return (
                <li key={stakeholder} className='px-4'>
                  <CheckboxWithLabel
                    label={stakeholder}
                    checked={index !== -1}
                    onCheckedChange={(checked) => toggleStakeholder(stakeholder, checked)}
                  />
                  {index !== -1 ? (
                    <FormSelect<
                      RegistrationFormValues,
                      `ecologicalMonitoringStakeholders.${number}.stakeholderType`
                    >
                      name={`ecologicalMonitoringStakeholders.${index}.stakeholderType`}
                      label={`${stakeholder}: paid or voluntary`}
                      labelClassName='sr-only'
                      placeholder={language.form.selectLabel}
                      options={stakeholderTypeOptions}
                      className='mb-2 ml-8 max-w-48'
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
        </FormQuestionDiv>

        {selectQuestion('mangroveAreaIncrease')}
        {mangroveAreaIncrease === 'Yes' || mangroveAreaIncrease === 'No' ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>
              {questions.preAndPostRestorationActivities.question}
            </p>
            <div className='flex max-w-80 flex-col gap-3'>
              {(['Pre', 'Post'] as const).map((when) => {
                const area = when === 'Pre' ? 'areaPreIntervention' : 'areaPostIntervention'
                const unit = `unit${when}` as const
                const otherUnit = `unit${when}Other` as const
                const label = `${when.toLowerCase()}-intervention`
                return (
                  <div key={when} className='flex flex-col gap-3'>
                    <FormInput<
                      RegistrationFormValues,
                      `preAndPostRestorationActivities.${typeof area}`
                    >
                      name={`preAndPostRestorationActivities.${area}`}
                      label={`Area ${label}`}
                    />
                    <FormSelect<
                      RegistrationFormValues,
                      `preAndPostRestorationActivities.${typeof unit}`
                    >
                      name={`preAndPostRestorationActivities.${unit}`}
                      label={`Unit ${label}`}
                      placeholder='select unit'
                      options={unitSelectOptions}
                    />
                    {prePost?.[unit] === 'other' ? (
                      <FormInput<
                        RegistrationFormValues,
                        `preAndPostRestorationActivities.${typeof otherUnit}`
                      >
                        name={`preAndPostRestorationActivities.${otherUnit}`}
                        label={`Other unit ${label}`}
                        placeholder='specify other unit'
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          </FormQuestionDiv>
        ) : null}
        {selectQuestion('mangroveConditionImprovement')}
        {selectQuestion('naturalRegenerationOnSite')}
        {showSurvival ? (
          <>
            <FormQuestionDiv>
              <FormInput<RegistrationFormValues, 'percentageSurvival'>
                name='percentageSurvival'
                label={questions.percentageSurvival.question}
                labelClassName={stickyFormLabelClassName}
                placeholder='Percentage'
                inputMode='decimal'
                className='max-w-80'
              />
            </FormQuestionDiv>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='causeOfLowSurvival'
                control={control}
                options={[...questions.causeOfLowSurvival.options]}
                question={questions.causeOfLowSurvival.question}
                shouldAddOtherOptionWithClarification
              />
              <ErrorText>{errors.causeOfLowSurvival?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
          </>
        ) : null}

        <FormQuestionDiv>
          <p className={stickyFormLabelClassName}>
            {questions.mangroveEcologicalOutcomes.question}
          </p>
          {monitoringIndicators.map((group) => {
            const groupLabel = `${group.category}: ${group.sub_category}`
            return (
              <div key={groupLabel} role='group' aria-label={groupLabel}>
                <span className={nestedLabel1}>{groupLabel}</span>
                <ul className='m-0 list-none p-0'>
                  {group.indicators.map((indicator) => (
                    <li key={`${indicator.indicator}-${indicator.metric}`} className='px-4'>
                      <CheckboxWithLabel
                        label={`${indicator.indicator}: ${indicator.metric}`}
                        checked={indicatorFields.some((f) => isSameIndicator(f, indicator))}
                        onCheckedChange={(checked) => toggleIndicator(group, indicator, checked)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </FormQuestionDiv>

        {indicatorFields.length ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>
              {questions.mangroveEcologicalOutcomesAdditionalData.question}
            </p>
            {indicatorFields.map((row, index) => (
              <EcologicalOutcomesRow
                key={row.id}
                index={index}
                groupLabel={`${row.mainLabel}: ${row.secondaryLabel}`}
                indicatorLabel={`${row.indicator ?? row.indictor}: ${row.metric}`}
                aims={aims}
              />
            ))}
            <ErrorText>
              {errors.monitoringIndicators?.root?.message ?? errors.monitoringIndicators?.message}
            </ErrorText>
          </FormQuestionDiv>
        ) : null}

        {selectQuestion('achievementOfEcologicalAims')}
      </FormLayout>
      {monitoringFormId ? (
        <DeleteMonitoringForm siteId={siteId} monitoringFormId={monitoringFormId} />
      ) : null}
    </ContentWrapper>
  )
}

export default EcologicalStatusAndOutcomesForm
