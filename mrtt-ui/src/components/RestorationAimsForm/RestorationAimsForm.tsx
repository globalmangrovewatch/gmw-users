'use client'

import { useParams } from 'next/navigation'
import { useFormContext, useWatch } from 'react-hook-form'

import { FormLayout, FormPageHeader, FormQuestionDiv } from '@/components/form/layout'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import LoadingIndicator from '@/components/LoadingIndicator'
import QuestionNav from '@/components/QuestionNav'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ContentWrapper } from '@/components/ui/layout'
import { ErrorText, PageSubtitle, PageTitle } from '@/components/ui/typography'
import { restorationAims as questions } from '@/data/questions'
import type { RegistrationFormValues } from '@/forms/schemas'
import language from '@/language'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'

import RestorationAimsCheckboxGroupWithLabel from './RestorationAimsCheckboxGroupWithLabel'
import type { AimFieldName } from './types'

const aimQuestions: { fieldName: AimFieldName; required: boolean }[] = [
  { fieldName: 'ecologicalAims', required: true },
  { fieldName: 'socioEconomicAims', required: true },
  { fieldName: 'otherAims', required: false }
]

function RestorationAimsForm() {
  const form = useFormContext<RegistrationFormValues>()
  const errors = form.formState.errors
  const { site_name } = useSiteInfo()
  const { siteId } = useParams<{ siteId: string }>()
  // Stakeholders are answered in Site background (2.1).
  const stakeholders = useWatch({ control: form.control, name: 'stakeholders' }) ?? []

  const { data, isLoading } = useInitializeQuestionMappedForm({
    key: 'restorationAims',
    siteId,
    form
  })

  const savedStakeholders = data?.formattedData.siteBackground?.stakeholders
  const areThereStakeholders =
    stakeholders.length > 0 || (Array.isArray(savedStakeholders) && savedStakeholders.length > 0)

  if (isLoading) return <LoadingIndicator />

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.restorationAims}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={aimQuestions.some(({ fieldName }) => !!errors[fieldName])}
        currentSection='restoration-aims'
      />
      <FormValidationMessageIfErrors formErrors={errors} />
      <FormLayout>
        {aimQuestions.map(({ fieldName, required }) => (
          <FormQuestionDiv key={fieldName}>
            {!areThereStakeholders ? (
              <Alert variant='info' role='status' className='mb-2'>
                <AlertDescription className='text-brand-900'>
                  {language.pages.restorationAims.missingStakeholdersWarning}
                </AlertDescription>
              </Alert>
            ) : null}
            <RestorationAimsCheckboxGroupWithLabel
              stakeholders={stakeholders}
              fieldName={fieldName}
              options={questions[fieldName].options}
              question={questions[fieldName].question}
              showAsterisk={required}
            />
            <ErrorText>{errors[fieldName]?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ))}
      </FormLayout>
    </ContentWrapper>
  )
}

export default RestorationAimsForm
