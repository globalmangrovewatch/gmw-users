import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  //   QuestionSubSection,
  StickyFormLabel
} from '../../styles/forms'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import language from '../../language'
import { ContentWrapper } from '../../styles/containers'
import { questionMapping } from '../../data/questionMapping'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { mapDataForApi } from '../../library/mapDataForApi'
import { socioeconomicGovernanceStatusOutcomes as questions } from '../../data/questions'
import LoadingIndicator from '../LoadingIndicator'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'

const SocioeconomicAndGovernanceStatusAndOutcomes = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({ dateOfOutcomesAssessment: yup.string().nullable() })
  const reactHookFormInstance = useForm({
    defaultValues: {},
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm,
    control,
    watch: watchForm
  } = reactHookFormInstance

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.socioeconomicAndGovernanceStatusAndOutcomes,
    resetForm,
    setIsLoading
    // successCallback: loadServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('socioeconomicAndGovernanceStatusAndOutcomes', formData))
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
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteInterventions}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='site-interventions'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.dateOfOutcomesAssessment.question}</StickyFormLabel>
          <Controller
            name='dateOfOutcomesAssessment'
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='date-of-outcomes-assessment'
                    label='date'
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue?.toISOString())
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            )}
          />
          <ErrorText>{errors.dateOfOutcomesAssessment?.message}</ErrorText>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

export default SocioeconomicAndGovernanceStatusAndOutcomes
