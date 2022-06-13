import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonSubmit } from '../../styles/buttons'
import { ErrorText } from '../../styles/typography'
import { Form, MainFormDiv, SectionFormTitle } from '../../styles/forms'
import { mapDataForApi } from '../../library/mapDataForApi'
import { multiselectWithOtherValidation } from '../../validation/multiSelectWithOther'
import { questionMapping } from '../../data/questionMapping'
import { restorationAims as questions } from '../../data/questions'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import formatApiAnswersForForm from '../../library/formatApiAnswersForForm'
import language from '../../language'
import LoadingIndicator from '../LoadingIndicator'

const RestorationAimsForm = () => {
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const _loadSiteData = useEffect(() => {
    if (apiAnswersUrl && resetForm) {
      setIsLoading(true)
      axios
        .get(apiAnswersUrl)
        .then(({ data }) => {
          setIsLoading(false)
          const initialValuesForForm = formatApiAnswersForForm({
            apiAnswers: data,
            questionMapping: questionMapping.restorationAims
          })
          resetForm(initialValuesForForm)
        })
        .catch(() => {
          toast.error(language.error.apiLoad)
        })
    }
  }, [apiAnswersUrl, resetForm])

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    axios
      .patch(apiAnswersUrl, mapDataForApi('restorationAims', formData))
      .then(() => {
        setIsSubmitting(false)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      <SectionFormTitle>Restoration Aims</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <CheckboxGroupWithLabelAndController
          fieldName='ecologicalAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.ecologicalAims.options}
          question={questions.ecologicalAims.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.ecologicalAims?.selectedValues?.message}</ErrorText>
        <CheckboxGroupWithLabelAndController
          fieldName='socioEconomicAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.socioEconomicAims.options}
          question={questions.socioEconomicAims.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.socioEconomicAims?.selectedValues?.message}</ErrorText>
        <CheckboxGroupWithLabelAndController
          fieldName='otherAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.otherAims.options}
          question={questions.otherAims.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.otherAims?.selectedValues?.message}</ErrorText>

        {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </Form>
    </MainFormDiv>
  )
}

export default RestorationAimsForm
