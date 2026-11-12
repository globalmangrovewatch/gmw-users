'use client'

import { useParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  stickyFormLabelClassName
} from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import LoadingIndicator from '@/components/LoadingIndicator'
import QuestionNav from '@/components/QuestionNav'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { costs as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import { findRegistationDataItem } from '@/library/findDataItems'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'
import type { RegistrationAnswer } from '@/types/api'

import AddProjectFunderNamesRow from './AddProjectFunderNamesRow'
import BreakdownOfCostRow, { currencyOptions } from './BreakdownOfCostRow'
import PercentageSplitOfActivitiesRow from './PercentageSplitOfActivitiesRow'
import ProjectFunderNamesRow from './ProjectFunderNamesRow'

type MultiselectAnswer = {
  selectedValues?: string[]
  isOtherChecked?: boolean
  otherValue?: string
}

const defaultBreakdownOfCost = [
  'Project planning & management',
  'Biophysical interventions',
  'Community activities',
  'Site maintenance',
  'Monitoring',
  'Other costs'
].map((costType) => ({ costType, cost: 0 }))

const fundingTypeOptions = getOptionsValuesAndLabels(questions.projectInterventionFunding.options)

const asList = (answer: unknown) => (Array.isArray(answer) ? answer : [])

// 7.5a starts with one row per intervention (6.2) and other activity (6.4, plus its "other").
const interventionsFromAnswers = (answers: RegistrationAnswer[]) => {
  const biophysical = findRegistationDataItem(answers, '6.2') as MultiselectAnswer | undefined
  const otherActivities = findRegistationDataItem(answers, '6.4') as MultiselectAnswer | undefined
  const other =
    otherActivities?.isOtherChecked && otherActivities.otherValue
      ? [otherActivities.otherValue]
      : []
  return [
    ...(biophysical?.selectedValues ?? []),
    ...(otherActivities?.selectedValues ?? []),
    ...other
  ].filter((intervention) => intervention !== 'None')
}

const toNumber = (value: unknown) => Number(value ?? 0)

function CostsForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()
  const [hasEndDate, setHasEndDate] = useState(false)
  const [showAddFunderRow, setShowAddFunderRow] = useState(false)

  const {
    fields: funderFields,
    append: funderAppend,
    remove: funderRemove
  } = useFieldArray({ name: 'projectFunderNames', control })
  const { fields: breakdownFields, replace: breakdownReplace } = useFieldArray({
    name: 'breakdownOfCost',
    control
  })
  const { fields: splitFields, replace: splitReplace } = useFieldArray({
    name: 'percentageSplitOfActivities',
    control
  })

  const supportForActivities = useWatch({ control, name: 'supportForActivities' })
  const fundingType = useWatch({ control, name: 'projectInterventionFunding.fundingType' })
  const totalCost = useWatch({ control, name: 'costOfProjectActivities.cost' })
  const breakdownOfCost = useWatch({ control, name: 'breakdownOfCost' }) ?? []

  const loadServerData = useCallback(
    (answers: RegistrationAnswer[]) => {
      if (findRegistationDataItem(answers, '1.1b')) setHasEndDate(true)
      if (!asList(findRegistationDataItem(answers, '7.5')).length) {
        breakdownReplace(defaultBreakdownOfCost)
      }
      if (!asList(findRegistationDataItem(answers, '7.5a')).length) {
        splitReplace(interventionsFromAnswers(answers).map((intervention) => ({ intervention })))
      }
    },
    [breakdownReplace, splitReplace]
  )

  const { isLoading } = useInitializeQuestionMappedForm({
    key: 'costs',
    siteId,
    form,
    successCallback: loadServerData
  })

  const breakdownTotal = breakdownOfCost.reduce((sum, item) => sum + toNumber(item?.cost), 0)
  const breakdownExceedsTotal = !(breakdownTotal <= toNumber(totalCost))
  const selectedSupport = supportForActivities?.selectedValues ?? []

  if (isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.costs}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav isFormSaving={false} isFormSaveError={false} currentSection='costs' />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='supportForActivities'
            control={control}
            options={[...questions.supportForActivities.options]}
            question={questions.supportForActivities.question}
            shouldAddOtherOptionWithClarification={false}
          />
          <ErrorText>{errors.supportForActivities?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>

        <FormQuestionDiv>
          <FormSelect<RegistrationFormValues, 'projectInterventionFunding.fundingType'>
            name='projectInterventionFunding.fundingType'
            label={questions.projectInterventionFunding.question}
            labelClassName={stickyFormLabelClassName}
            placeholder={language.form.selectLabel}
            options={fundingTypeOptions}
          />
          {fundingType === 'Other' ? (
            <FormInput<RegistrationFormValues, 'projectInterventionFunding.other'>
              name='projectInterventionFunding.other'
              label='Other finance mechanism'
              labelClassName='sr-only'
              placeholder='please state other'
              className='mt-4 max-w-80'
            />
          ) : null}
        </FormQuestionDiv>

        {selectedSupport.includes('Monetary') ? (
          <>
            <FormQuestionDiv>
              <p className={stickyFormLabelClassName}>{questions.projectFunderNames.question}</p>
              {funderFields.map((funder, index) => (
                <ProjectFunderNamesRow
                  key={funder.id}
                  index={index}
                  label={funder.funderName ?? ''}
                  onDelete={funderRemove}
                />
              ))}
              <ErrorText>
                {errors.projectFunderNames?.root?.message ?? errors.projectFunderNames?.message}
              </ErrorText>
              {showAddFunderRow ? (
                <AddProjectFunderNamesRow
                  saveItem={funderAppend}
                  updateTabularInputDisplay={setShowAddFunderRow}
                />
              ) : (
                <Button
                  type='button'
                  variant='outline'
                  className='mt-6 self-start'
                  onClick={() => setShowAddFunderRow(true)}>
                  + Add measurement row
                </Button>
              )}
            </FormQuestionDiv>

            <FormQuestionDiv>
              <p className={stickyFormLabelClassName}>
                {hasEndDate
                  ? questions.costOfProjectActivities.question
                  : '7.4 What is the total cost of the project activities at the site to date?'}
              </p>
              <div className='mt-4 flex flex-wrap items-start gap-3'>
                <FormInput<RegistrationFormValues, 'costOfProjectActivities.cost'>
                  name='costOfProjectActivities.cost'
                  label='Total cost'
                  labelClassName='sr-only'
                  placeholder='enter cost'
                  inputMode='decimal'
                  defaultValue={0}
                  className='w-52'
                />
                <FormSelect<RegistrationFormValues, 'costOfProjectActivities.currency'>
                  name='costOfProjectActivities.currency'
                  label='Total cost currency'
                  labelClassName='sr-only'
                  placeholder='currency'
                  options={currencyOptions}
                  className='w-32'
                />
              </div>
            </FormQuestionDiv>

            <FormQuestionDiv>
              <p className={stickyFormLabelClassName}>{questions.breakdownOfCost.question}</p>
              {breakdownFields.map((item, index) => (
                <BreakdownOfCostRow key={item.id} index={index} label={item.costType ?? ''} />
              ))}
              <ErrorText>
                {errors.breakdownOfCost?.root?.message ?? errors.breakdownOfCost?.message}
              </ErrorText>
              <p className='mt-4'>Total: {breakdownTotal.toLocaleString()}</p>
              {breakdownExceedsTotal ? (
                <ErrorText>Breakdown of activities must not exceed total cost in 7.4</ErrorText>
              ) : null}
            </FormQuestionDiv>

            <FormQuestionDiv>
              <p className={stickyFormLabelClassName}>
                {questions.percentageSplitOfActivities.question}
              </p>
              {splitFields.length ? (
                splitFields.map((item, index) => (
                  <PercentageSplitOfActivitiesRow
                    key={item.id}
                    index={index}
                    label={item.intervention ?? ''}
                  />
                ))
              ) : (
                <Alert variant='info'>
                  <AlertDescription>
                    {language.pages.costs.missingInterventionsWarning}
                  </AlertDescription>
                </Alert>
              )}
              <ErrorText>
                {errors.percentageSplitOfActivities?.root?.message ??
                  errors.percentageSplitOfActivities?.message}
              </ErrorText>
            </FormQuestionDiv>
          </>
        ) : null}

        {selectedSupport.includes('Voluntary/Non-monetary') ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='nonmonetisedContributions'
              control={control}
              options={[...questions.nonmonetisedContributions.options]}
              question={questions.nonmonetisedContributions.question}
              shouldAddOtherOptionWithClarification
            />
            <ErrorText>{errors.nonmonetisedContributions?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
      </FormLayout>
    </ContentWrapper>
  )
}

export default CostsForm
