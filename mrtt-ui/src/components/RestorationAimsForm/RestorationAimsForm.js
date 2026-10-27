import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { ContentWrapper } from '@/styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '@/styles/typography'
import { FormLayout, FormPageHeader, FormQuestionDiv } from '@/styles/forms'
import { restorationAims as questions } from '@/data/questions'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
import QuestionNav from '@/components/QuestionNav'
import RestorationAimsCheckboxGroupWithLabel from './RestorationAimsCheckboxGroupWithLabel'
import { useInitializeQuestionMappedForm } from '@/library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '@/library/useSiteInfo'
import { Alert } from '@mui/material'

const RestorationAimsForm = () => {
  const form = useFormContext()
  const stakeholders = form.getValues('stakeholders') || []
  const { site_name } = useSiteInfo()
  const { siteId } = useParams()

  const errors = form.errors

  const { data, isLoading } = useInitializeQuestionMappedForm({
    key: 'restorationAims',
    siteId,
    form
  })

  // TO DO
  // helper to get sections, if any, with errors questions, answers, errors
  const noStakeholdersWarning = (
    <Alert severity='info'>{language.pages.restorationAims.missingStakeholdersWarning}</Alert>
  )
  const areThereStakeholders = useMemo(() => {
    const currentStakeholders =
      form.getValues('stakeholders') || data?.formattedData.siteBackground.stakeholders || []
    return !!(currentStakeholders && currentStakeholders.length)
  }, [form, data])

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.restorationAims}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={form.formState.errors['restorationAims']}
        currentSection='restoration-aims'
      />
      <FormValidationMessageIfErrors formErrors={errors} />
      <FormLayout>
        <FormQuestionDiv>
          {!areThereStakeholders ? noStakeholdersWarning : null}
          <RestorationAimsCheckboxGroupWithLabel
            stakeholders={stakeholders}
            fieldName='ecologicalAims'
            form={form}
            options={questions.ecologicalAims?.options}
            question={questions.ecologicalAims.question}
            showAsterisk
          />
          <ErrorText>{errors?.ecologicalAims?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {!areThereStakeholders ? noStakeholdersWarning : null}
          <RestorationAimsCheckboxGroupWithLabel
            stakeholders={stakeholders}
            fieldName='socioEconomicAims'
            form={form}
            options={questions.socioEconomicAims.options}
            question={questions.socioEconomicAims.question}
            showAsterisk
          />
          <ErrorText>{errors?.socioEconomicAims?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {!areThereStakeholders ? noStakeholdersWarning : null}
          <RestorationAimsCheckboxGroupWithLabel
            stakeholders={stakeholders}
            fieldName='otherAims'
            form={form}
            options={questions.otherAims.options}
            question={questions.otherAims.question}
          />
          <ErrorText>{errors?.otherAims?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
    </ContentWrapper>
  )
}

export default RestorationAimsForm
