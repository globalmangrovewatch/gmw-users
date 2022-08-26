import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Stack, TextField } from '@mui/material'

import { Form, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../../styles/forms'
import { ContentWrapper } from '../../styles/containers'
import { managementStatusAndEffectiveness as questions } from '../../data/questions'
import LoadingIndicator from '../LoadingIndicator'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import language from '../../language'
import { mapDataForApi } from '../../library/mapDataForApi'
import { questionMapping } from '../../data/questionMapping'

const ManagementStatusAndEffectivenessForm = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({ dateOfAssessment: yup.string() })
  const reactHookFormInstance = useForm({
    defaultValues: {},
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
    questionMapping: questionMapping.managementStatusAndEffectiveness,
    resetForm,
    setIsLoading
    // successCallback: loadServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('managementStatusAndEffectiveness', formData))
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
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.managementStatusAndEffectiveness}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isSaving={isSubmitting}
        isSaveError={isSubmitError}
        onSave={validateInputs(handleSubmit)}
        currentSection='managementStatusAndEffectiveness'
      />
      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.dateOfAssessment.question}</StickyFormLabel>
          <Controller
            name='dateOfAssessment'
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='date-of-assessment'
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
          <ErrorText>{errors.dateOfAssessment?.message}</ErrorText>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

export default ManagementStatusAndEffectivenessForm
