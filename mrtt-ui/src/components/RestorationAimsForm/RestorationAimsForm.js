import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import axios from 'axios'

import { ContentWrapper } from '../../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { FormLayout, FormPageHeader, FormQuestionDiv } from '../../styles/forms'
import { mapDataForApi } from '../../library/mapDataForApi'
import { questionMapping } from '../../data/questionMapping'
import { restorationAims as questions } from '../../data/questions'
import { toast } from 'react-toastify'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import language from '../../language'
import LoadingIndicator from '../LoadingIndicator'
import QuestionNav from '../QuestionNav'
import RestorationAimsCheckboxGroupWithLabel from './RestorationAimsCheckboxGroupWithLabel'
import { useInitializeQuestionMappedForm } from '../../library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '../../library/useSiteInfo'
import { Alert } from '@mui/material'

const getStakeholders = (registrationAnswersFromServer) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === '2.1')
    ?.answer_value ?? []

const RestorationAimsForm = () => {
  const form = useFormContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stakeholders, setStakeholders] = useState(form.getValues('stakeholders') || [])
  const { site_name } = useSiteInfo()
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`
  const areThereStakeholders = !!stakeholders.length

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm
  } = form

  const loadStakeholdersFromServerData = useCallback((serverResponse) => {
    setStakeholders(getStakeholders(serverResponse))
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.restorationAims,
    resetForm,
    setIsLoading,
    successCallback: loadStakeholdersFromServerData
  })

  const handleSubmit = async (formData) => {
    const fields = Object.keys(questionMapping['restorationAims'])
    const ok = await form.trigger(fields, { shouldFocus: true })
    if (!ok) {
      setIsError(true)
      toast.error(language.error.validation)
      return
    }
    setIsSubmitting(true)
    setIsError(false)
    if (!formData) return

    axios
      .patch(apiAnswersUrl, mapDataForApi('restorationAims', formData))
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsError(true)
        toast.error(language.error.submit)
      })
  }

  const noStakeholdersWarning = (
    <Alert severity='info'>{language.pages.restorationAims.missingStakeholdersWarning}</Alert>
  )

  const fields = Object.keys(questionMapping['restorationAims'])
  const restorationAmisErrors = fields.filter((field) => errors[field])

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.restorationAims}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isError}
        onFormSave={() => handleSubmit(form.getValues())}
        currentSection='restoration-aims'
      />
      <FormValidationMessageIfErrors formErrors={errors} />
      <FormLayout onSubmit={() => handleSubmit(form.getValues())}>
        <FormQuestionDiv>
          {!areThereStakeholders ? noStakeholdersWarning : null}
          <RestorationAimsCheckboxGroupWithLabel
            stakeholders={stakeholders}
            fieldName='ecologicalAims'
            form={form}
            options={questions.ecologicalAims.options}
            question={questions.ecologicalAims.question}
            showAsterisk
          />
          <ErrorText>{errors.ecologicalAims?.selectedValues?.message}</ErrorText>
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
          <ErrorText>{errors.socioEconomicAims?.selectedValues?.message}</ErrorText>
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
          <ErrorText>{errors.otherAims?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
    </ContentWrapper>
  )
}

export default RestorationAimsForm
