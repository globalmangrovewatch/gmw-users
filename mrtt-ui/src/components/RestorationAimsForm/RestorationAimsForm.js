import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonSubmit } from '../../styles/buttons'
import { ErrorText, Link } from '../../styles/typography'
import { Form, MainFormDiv, SectionFormTitle } from '../../styles/forms'
import { mapDataForApi } from '../../library/mapDataForApi'
import { multiselectWithOtherValidation } from '../../validation/multiSelectWithOther'
import { questionMapping } from '../../data/questionMapping'
import { restorationAims as questions } from '../../data/questions'
import { toast } from 'react-toastify'
import language from '../../language'
import LoadingIndicator from '../LoadingIndicator'
import RestorationAimsCheckboxGroupWithLabel from './RestorationAimsCheckboxGroupWithLabel'
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'

const getStakeholders = (registrationAnswersFromServer) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === '2.1')
    ?.answer_value ?? []
const RestorationAimsForm = () => {
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stakeholders, setStakeholders] = useState([])
  const validationSchema = yup.object({
    ecologicalAims: multiselectWithOtherValidation,
    socioEconomicAims: multiselectWithOtherValidation,
    otherAims: multiselectWithOtherValidation
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      ecologicalAims: { selectedValues: [], otherValue: undefined },
      socioEconomicAims: { selectedValues: [], otherValue: undefined },
      otherAims: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })
  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm
  } = reactHookFormInstance

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

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    axios
      .patch(apiAnswersUrl, mapDataForApi('restorationAims', formData))
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      <SectionFormTitle>Restoration Aims</SectionFormTitle>
      <Link to={-1}>&lt; {language.form.navigateBackToSiteOverview}</Link>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <RestorationAimsCheckboxGroupWithLabel
          stakeholders={stakeholders}
          fieldName='ecologicalAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.ecologicalAims.options}
          question={questions.ecologicalAims.question}
        />
        <ErrorText>{errors.ecologicalAims?.selectedValues?.message}</ErrorText>
        <RestorationAimsCheckboxGroupWithLabel
          stakeholders={stakeholders}
          fieldName='socioEconomicAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.socioEconomicAims.options}
          question={questions.socioEconomicAims.question}
        />
        <ErrorText>{errors.socioEconomicAims?.selectedValues?.message}</ErrorText>
        <RestorationAimsCheckboxGroupWithLabel
          stakeholders={stakeholders}
          fieldName='otherAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.otherAims.options}
          question={questions.otherAims.question}
        />
        <ErrorText>{errors.otherAims?.selectedValues?.message}</ErrorText>

        {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </Form>
    </MainFormDiv>
  )
}

export default RestorationAimsForm
