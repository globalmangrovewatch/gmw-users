import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { MenuItem, TextField } from '@mui/material'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  SectionFormSubtitle,
  SectionFormTitle,
  StickyFormLabel
} from '../styles/forms'
import QuestionNav from './QuestionNav'
import useSiteInfo from '../library/useSiteInfo'
import language from '../language'
import { ContentWrapper } from '../styles/containers'
import { costs as questions } from '../data/questions'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../validation/multiSelectWithOther'
import { ErrorText } from '../styles/typography'
import { mapDataForApi } from '../library/mapDataForApi'
import { questionMapping } from '../data/questionMapping'
import LoadingIndicator from './LoadingIndicator'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'

const CostsForm = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    supportForActivities: multiselectWithOtherValidationNoMinimum,
    projectInterventionFunding: yup.string(),
    nonmonetisedContributions: multiselectWithOtherValidationNoMinimum
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      supportForActivities: { selectedValues: [], otherValue: undefined },
      nonmonetisedContributions: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm,
    control
  } = reactHookFormInstance

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.costs,
    resetForm,
    setIsLoading
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('costs', formData))
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
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>{language.pages.siteQuestionsOverview.formName.costs}</SectionFormTitle>
        <SectionFormSubtitle>{site_name}</SectionFormSubtitle>
      </FormPageHeader>
      <QuestionNav
        isSaving={isSubmitting}
        isSaveError={isSubmitError}
        onSave={validateInputs(handleSubmit)}
        currentSection='costs'
      />
      <Form>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='supportForActivities'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.supportForActivities.options}
            question={questions.supportForActivities.question}
            shouldAddOtherOptionWithClarification={false}
          />
          <ErrorText>{errors.supportForActivities?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.projectInterventionFunding.question}</StickyFormLabel>
          <Controller
            name='projectInterventionFunding'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.projectInterventionFunding.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.projectInterventionFunding?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='nonmonetisedContributions'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.nonmonetisedContributions.options}
            question={questions.nonmonetisedContributions.question}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.nonmonetisedContributions?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

CostsForm.propTypes = {}

export default CostsForm
