'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import CheckboxWithLabel from '@/components/form/CheckboxWithLabel'
import { FormSelect } from '@/components/form/FormInput'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  stickyFormLabelClassName
} from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import LoadingIndicator from '@/components/LoadingIndicator'
import DeleteMonitoringForm from '@/components/MonitoringForm/DeleteMonitoringForm'
import MonitoringDateField from '@/components/MonitoringForm/MonitoringDateField'
import QuestionNav from '@/components/QuestionNav'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { socioeconomicGovernanceStatusOutcomes as questions } from '@/data/questions'
import { socioIndicators } from '@/data/socioIndicators'
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

import SocioeconomicOutcomesRow from './SocioeconomicOutcomesRow'

type SelectQuestion =
  | 'changeInGovernance'
  | 'changeInTenureArrangement'
  | 'rightsToLandInLaw'
  | 'achievementOfSocioeconomicAims'

type AimsAnswer = { selectedValues?: string[]; otherValue?: string }

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

// An outcome can be linked to the socioeconomic aims of 3.2 (with its "other"), or to none.
const aimsFromAnswers = (answers: RegistrationAnswer[] | undefined) => {
  const aims = findRegistationDataItem(answers, '3.2') as AimsAnswer | undefined
  if (!aims?.selectedValues?.length) return []
  return [...aims.selectedValues, 'Not applicable', ...(aims.otherValue ? [aims.otherValue] : [])]
}

function SocioeconomicGovernanceStatusAndOutcomesForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()
  const monitoringFormId = useMonitoringFormId()

  const {
    fields: outcomeFields,
    append: outcomeAppend,
    remove: outcomeRemove,
    replace: outcomeReplace
  } = useFieldArray({ name: 'socioeconomicOutcomes', control })

  const changeInGovernance = useWatch({ control, name: 'changeInGovernance' })
  const changeInTenureArrangement = useWatch({ control, name: 'changeInTenureArrangement' })

  const registrationQuery = useQuery({ ...siteQueries.registration(siteId), enabled: !!siteId })
  useLoadErrorToast(registrationQuery.error)
  const aims = useMemo(() => aimsFromAnswers(registrationQuery.data), [registrationQuery.data])

  const onLoaded = useCallback(
    (_monitor: unknown, sectionData: Record<string, unknown>) => {
      const sectionValues = sectionData as Partial<RegistrationFormValues>
      // Load the rows through the field array so its `fields` match the saved answers.
      queueMicrotask(() => outcomeReplace(sectionValues.socioeconomicOutcomes ?? []))
    },
    [outcomeReplace]
  )

  const monitorQuery = useInitializeQuestionMappedFormMonitors({
    key: 'socioeconomicGovernanceStatusAndOutcomes',
    siteId,
    monitorId: monitoringFormId,
    form,
    successCallback: onLoaded
  })

  const toggleOutcome = (
    indicator: (typeof socioIndicators)[number],
    child: string,
    checked: boolean
  ) => {
    const index = outcomeFields.findIndex((f) => f.child === child)
    if (checked && index === -1) {
      outcomeAppend({
        mainLabel: indicator.label,
        secondaryLabel: indicator.secondaryLabel,
        child,
        type: '',
        trend: '',
        linkedAims: [],
        measurement: '',
        unit: '',
        comparison: '',
        value: ''
      })
    }
    if (!checked && index !== -1) outcomeRemove(index)
  }

  if (registrationQuery.isLoading || monitorQuery.isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.socioeconomicGovernanceStatusOutcomes}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='socioeconomic-and-governance-status'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <MonitoringDateField
            name='dateOfOutcomesAssessment'
            question={questions.dateOfOutcomesAssessment.question}
            label='date'
            labelClassName={stickyFormLabelClassName}
            required
          />
        </FormQuestionDiv>
        {selectQuestion('changeInGovernance')}
        {changeInGovernance === 'Yes' ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='currentGovenance'
              control={control}
              options={[...questions.currentGovenance.options]}
              question={questions.currentGovenance.question}
              shouldAddOtherOptionWithClarification={false}
            />
            <ErrorText>{errors.currentGovenance?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        {selectQuestion('changeInTenureArrangement')}
        {changeInTenureArrangement === 'Yes' ? (
          <>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='currentLandOwnership'
                control={control}
                options={[...questions.currentLandOwnership.options]}
                question={questions.currentLandOwnership.question}
                shouldAddOtherOptionWithClarification
              />
              <ErrorText>{errors.currentLandOwnership?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
            {selectQuestion('rightsToLandInLaw')}
          </>
        ) : null}

        <FormQuestionDiv>
          <p className={stickyFormLabelClassName}>{questions.socioeconomicOutcomes.question}</p>
          {socioIndicators.map((indicator) => {
            const groupLabel = `${indicator.label}: ${indicator.secondaryLabel}`
            return (
              <div key={groupLabel} role='group' aria-label={groupLabel}>
                <span className={nestedLabel1}>{groupLabel}</span>
                <ul className='m-0 list-none p-0'>
                  {indicator.children.map((child) => (
                    <li key={child} className='px-4'>
                      <CheckboxWithLabel
                        label={child}
                        checked={outcomeFields.some((f) => f.child === child)}
                        onCheckedChange={(checked) => toggleOutcome(indicator, child, checked)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </FormQuestionDiv>

        {outcomeFields.length ? (
          <FormQuestionDiv>
            <p className={stickyFormLabelClassName}>
              {questions.socioeconomicOutcomesAdditionalData.question}
            </p>
            {outcomeFields.map((outcome, index) => (
              <SocioeconomicOutcomesRow
                key={outcome.id}
                index={index}
                outcome={outcome.child ?? ''}
                aims={aims}
              />
            ))}
            <ErrorText>
              {errors.socioeconomicOutcomes?.root?.message ?? errors.socioeconomicOutcomes?.message}
            </ErrorText>
          </FormQuestionDiv>
        ) : null}

        {selectQuestion('achievementOfSocioeconomicAims')}
      </FormLayout>
      {monitoringFormId ? (
        <DeleteMonitoringForm siteId={siteId} monitoringFormId={monitoringFormId} />
      ) : null}
    </ContentWrapper>
  )
}

export default SocioeconomicGovernanceStatusAndOutcomesForm
