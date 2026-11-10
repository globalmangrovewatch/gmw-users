'use client'

import { useParams } from 'next/navigation'
import { useFieldArray, useFormContext, useWatch, type FieldPath } from 'react-hook-form'

import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  StickyFormLabel,
  stickyFormLabelClassName
} from '@/components/form/layout'
import { FormInput, FormSelect } from '@/components/form/FormInput'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import QuestionNav from '@/components/QuestionNav'
import RequiredIndicator from '@/components/RequiredIndicator'
import { Checkbox } from '@/components/ui/checkbox'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { siteBackground as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import { makeValidClassName } from '@/library/strings/makeValidClassName'
import useSiteInfo from '@/library/useSiteInfo'

type SelectQuestion =
  | 'managementStatus'
  | 'lawStatus'
  | 'areStakeholdersInvolved'
  | 'customaryRights'

function SiteBackgroundForm() {
  const form = useFormContext<RegistrationFormValues>()
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()

  useInitializeQuestionMappedForm({ siteId, key: 'siteBackground', form })

  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control: form.control })

  const watchedStakeholders = useWatch({ control: form.control, name: 'stakeholders' }) ?? []

  const toggleStakeholder = (stakeholderType: string, checked: boolean) => {
    const index = stakeholdersFields.findIndex((f) => f.stakeholderType === stakeholderType)
    if (!checked && index !== -1) stakeholdersRemove(index)
    if (checked && index === -1) stakeholdersAppend({ stakeholderType })
  }

  const selectQuestion = (name: SelectQuestion) => (
    <FormQuestionDiv>
      <FormSelect<RegistrationFormValues, FieldPath<RegistrationFormValues>>
        name={name}
        label={questions[name].question}
        labelClassName={stickyFormLabelClassName}
        placeholder={language.form.selectLabel}
        options={getOptionsValuesAndLabels(questions[name].options)}
      />
    </FormQuestionDiv>
  )

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteBackground}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav isFormSaving={false} isFormSaveError={false} currentSection='site-background' />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel id='stakeholders-label'>
            {questions.stakeholders.question} <RequiredIndicator />
          </StickyFormLabel>
          <ul aria-labelledby='stakeholders-label' className='m-0 flex list-none flex-col p-0'>
            {questions.stakeholders.options.map((stakeholderType) => {
              const index = watchedStakeholders.findIndex(
                (s) => s.stakeholderType === stakeholderType
              )
              const checkboxId = makeValidClassName(`stakeholder-${stakeholderType}`)

              return (
                <li key={stakeholderType} className='flex flex-col gap-2 px-4 py-2'>
                  <label htmlFor={checkboxId} className='flex cursor-pointer items-center gap-3'>
                    <Checkbox
                      id={checkboxId}
                      value={stakeholderType}
                      checked={index !== -1}
                      onCheckedChange={(checked) => toggleStakeholder(stakeholderType, checked)}
                    />
                    <span>{stakeholderType}</span>
                  </label>
                  {index !== -1 && stakeholderType !== 'Unknown' ? (
                    <FormInput<RegistrationFormValues, `stakeholders.${number}.stakeholderName`>
                      name={`stakeholders.${index}.stakeholderName`}
                      label='Name'
                      defaultValue=''
                      className='mt-2 max-w-80'
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
          <ErrorText>{errors.stakeholders?.message}</ErrorText>
        </FormQuestionDiv>

        {selectQuestion('managementStatus')}
        {selectQuestion('lawStatus')}

        <FormQuestionDiv>
          <FormInput<RegistrationFormValues, 'managementArea'>
            name='managementArea'
            label={questions.managementArea.question}
            labelClassName={stickyFormLabelClassName}
          />
        </FormQuestionDiv>

        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='protectionStatus'
            control={form.control}
            options={[...questions.protectionStatus.options]}
            question={questions.protectionStatus.question}
            shouldAddOtherOptionWithClarification
          />
          <ErrorText>{errors.protectionStatus?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>

        {selectQuestion('areStakeholdersInvolved')}

        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='governmentArrangement'
            control={form.control}
            options={[...questions.governmentArrangement.options]}
            question={questions.governmentArrangement.question}
            shouldAddOtherOptionWithClarification
          />
          <ErrorText>{errors.governmentArrangement?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>

        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='landTenure'
            control={form.control}
            options={[...questions.landTenure.options]}
            question={questions.landTenure.question}
            shouldAddOtherOptionWithClarification
          />
          <ErrorText>{errors.landTenure?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>

        {selectQuestion('customaryRights')}
      </FormLayout>
    </ContentWrapper>
  )
}

export default SiteBackgroundForm
