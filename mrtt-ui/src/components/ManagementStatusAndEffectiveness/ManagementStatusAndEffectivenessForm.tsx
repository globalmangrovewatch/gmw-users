'use client'

import { useParams } from 'next/navigation'
import { useFormContext, useWatch } from 'react-hook-form'

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
import DeleteMonitoringForm from '@/components/MonitoringForm/DeleteMonitoringForm'
import MonitoringDateField from '@/components/MonitoringForm/MonitoringDateField'
import QuestionNav from '@/components/QuestionNav'
import { ContentWrapper } from '@/components/ui/layout'
import { PageSubtitle, PageTitle } from '@/components/ui/typography'
import { managementStatusAndEffectiveness as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import getOptionsValuesAndLabels from '@/library/getOptionsValuesAndLabels'
import { useInitializeQuestionMappedFormMonitors } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useMonitoringFormId from '@/library/useMonitoringFormId'
import useSiteInfo from '@/library/useSiteInfo'

type SelectQuestion =
  | 'stakeholderInfluence'
  | 'managementStatusChanges'
  | 'currentManagementStatus'
  | 'managementLaws'
  | 'projectStatusChange'
  | 'currentProtectionStatus'
  | 'financeForCiteManagement'
  | 'sufficientFunds'
  | 'resourcesToEnforceRegulations'
  | 'equitableSharingOfSiteBenefits'
  | 'climateChangeAdaptation'

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

// 8.4c, and (as before) the "other" answer of 8.6: both write the same answer.
const formalManagementAreaInput = (label: string, labelClassName?: string) => (
  <FormInput<RegistrationFormValues, 'nameOfFormalManagementArea'>
    name='nameOfFormalManagementArea'
    label={label}
    labelClassName={labelClassName}
    placeholder='enter name'
    className='max-w-80'
  />
)

function ManagementStatusAndEffectivenessForm() {
  const form = useFormContext<RegistrationFormValues>()
  const { control } = form
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()
  const monitoringFormId = useMonitoringFormId()

  const managementStatusChanges = useWatch({ control, name: 'managementStatusChanges' })
  const projectStatusChange = useWatch({ control, name: 'projectStatusChange' })
  const financeForCiteManagement = useWatch({ control, name: 'financeForCiteManagement' })

  const { isLoading } = useInitializeQuestionMappedFormMonitors({
    key: 'managementStatusAndEffectiveness',
    siteId,
    monitorId: monitoringFormId,
    form
  })

  if (isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.managementStatusAndEffectiveness}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='management-status-and-effectiveness'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <MonitoringDateField
            name='dateOfAssessment'
            question={questions.dateOfAssessment.question}
            label='date'
            labelClassName={stickyFormLabelClassName}
            required
          />
        </FormQuestionDiv>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='stakeholderManagement'
            control={control}
            options={[...questions.stakeholderManagement.options]}
            question={questions.stakeholderManagement.question}
            shouldAddOtherOptionWithClarification
          />
        </FormQuestionDiv>
        {selectQuestion('stakeholderInfluence')}
        {selectQuestion('managementStatusChanges')}
        {managementStatusChanges === 'Yes' ? (
          <>
            {selectQuestion('currentManagementStatus')}
            {selectQuestion('managementLaws')}
            <FormQuestionDiv>
              {formalManagementAreaInput(
                questions.nameOfFormalManagementArea.question,
                stickyFormLabelClassName
              )}
            </FormQuestionDiv>
          </>
        ) : null}
        {selectQuestion('projectStatusChange')}
        {projectStatusChange === 'Yes' ? selectQuestion('currentProtectionStatus') : null}
        <FormQuestionDiv>
          <FormSelect<RegistrationFormValues, 'financeForCiteManagement'>
            name='financeForCiteManagement'
            label={questions.financeForCiteManagement.question}
            labelClassName={stickyFormLabelClassName}
            placeholder={language.form.selectLabel}
            options={getOptionsValuesAndLabels(questions.financeForCiteManagement.options)}
          />
          {financeForCiteManagement === 'Other' ? (
            <div className='mt-4'>{formalManagementAreaInput('Other finance', 'sr-only')}</div>
          ) : null}
        </FormQuestionDiv>
        {selectQuestion('sufficientFunds')}
        {selectQuestion('resourcesToEnforceRegulations')}
        {selectQuestion('equitableSharingOfSiteBenefits')}
        {selectQuestion('climateChangeAdaptation')}
      </FormLayout>
      {monitoringFormId ? (
        <DeleteMonitoringForm siteId={siteId} monitoringFormId={monitoringFormId} />
      ) : null}
    </ContentWrapper>
  )
}

export default ManagementStatusAndEffectivenessForm
