import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import { ContentWrapper } from '../../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { FormLayout, FormPageHeader, FormQuestionDiv } from '../../styles/forms'
import { questionMapping } from '../../data/questionMapping'
import { restorationAims as questions } from '../../data/questions'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import language from '../../language'
import LoadingIndicator from '../LoadingIndicator'
import QuestionNav from '../QuestionNav'
import RestorationAimsCheckboxGroupWithLabel from './RestorationAimsCheckboxGroupWithLabel'
import { useInitializeQuestionMappedForm } from '../../library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '../../library/useSiteInfo'
import { Alert } from '@mui/material'

const RestorationAimsForm = () => {
  const form = useFormContext()
  const stakeholders = form.getValues('stakeholders') || []
  const { site_name } = useSiteInfo()
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`

  const errors = form.errors

  const { data, isLoading } = useInitializeQuestionMappedForm({
    key: 'restorationAims',
    apiUrl: apiAnswersUrl,
    form,
    questionMapping
  })

  // const getStakeholders = useMemo(
  //   () => (registrationAnswersFromServer) =>
  //     registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === '2.1')
  //       ?.answer_value ?? [],
  //   []
  // )

  // const loadStakeholdersFromServerData = useCallback(
  //   (serverResponse) => {
  //     return setStakeholders(getStakeholders(serverResponse))
  //   },
  //   [getStakeholders]
  // )
  // const { data, isError, error } = useInitializeQuestionMappedForm({
  //   apiUrl: apiAnswersUrl,
  //   resetForm: form.reset,
  //   questionMapping: questionMapping.restorationAims,
  //   successCallback: loadStakeholdersFromServerData,
  //   queryOptions: {
  //     select: ({ response, formattedData }) => {
  //       const stakeholders =
  //         response.data.find((item) => item.question_id === '2.1')?.answer_value ?? []

  //       return {
  //         response,
  //         formattedData,
  //         stakeholders
  //       }
  //     }
  //   }
  // })

  // const areThereStakeholders = !!data?.stakeholders.length

  // const handleSubmit = async (values: any) => {
  //   const fields = Object.keys(questionMapping.restorationAims)
  //   const ok = await form.trigger(fields, { shouldFocus: true })
  //   if (!ok) {
  //     setIsSubmitError(true)
  //     toast.error(language.error.validation)
  //     return
  //   }
  //   setIsSubmitting(true)
  //   setIsSubmitError(false)

  //   if (!values) return

  //   const payload = mapDataForApi('restorationAims', values)

  //   axios
  //     .patch(apiAnswersUrl, payload)
  //     .then(() => {
  //       setIsSubmitError(false)
  //       setIsSubmitting(false)
  //       toast.success(language.success.submit)
  //     })
  //     .catch(() => {
  //       setIsSubmitting(false)
  //       setIsSubmitError(true)
  //       toast.error(language.error.submit)
  //     })
  // }

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
