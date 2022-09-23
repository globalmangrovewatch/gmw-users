import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Controller, useForm } from 'react-hook-form'
import { MenuItem, Stack, TextField } from '@mui/material'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  QuestionSubSection,
  StickyFormLabel
} from '../../styles/forms'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import language from '../../language'
import { ContentWrapper } from '../../styles/containers'
import { questionMapping } from '../../data/questionMapping'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { mapDataForApi } from '../../library/mapDataForApi'
import { ecologicalStatusOutcomes as questions } from '../../data/questions'
import LoadingIndicator from '../LoadingIndicator'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import useInitializeMonitoringForm from '../../library/useInitializeMonitoringForm'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../../validation/multiSelectWithOther'
import { findDataItem } from '../../library/findDataItem'
import MONITORING_FORM_TYPES from '../../constants/monitoringFormTypes'

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2') ?? []

const EcologicalStatusAndOutcomesForm = () => {
  const { site_name } = useSiteInfo()
  const { monitoringFormId } = useParams()
  const isEditMode = !!monitoringFormId
  const navigate = useNavigate()
  const validationSchema = yup.object({
    monitoringStartDate: yup.string().nullable().required(language.form.required),
    monitoringEndDate: yup.string().nullable(),
    ecologicalMonitoringStakeholders: multiselectWithOtherValidationNoMinimum,
    mangroveAreaIncrease: yup.string(),
    mangroveConditionImprovement: yup.string(),
    naturalRegenerationOnSite: yup.string(),
    percentageSurvival: yup.mixed(),
    causeOfLowSurvival: multiselectWithOtherValidationNoMinimum,
    achievementOfEcologicalAims: yup.string()
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      ecologicalMonitoringStakeholders: { selectedValues: [] },
      causeOfLowSurvival: { selectedValues: [] }
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
  const interventionAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/intervention_answers`
  const monitoringFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
  const monitoringFormSingularUrl = `${monitoringFormsUrl}/${monitoringFormId}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isMainFormDataLoading, setIsMainFormDataLoading] = useState(false)
  const [areBiophysicalInterventionsLoading, setAreBiophysicalInterventionsLoading] =
    useState(false)
  const [biophysicalInterventions, setBiophysicalInterventions] = useState([])

  useEffect(
    function loadBiophysicalInterventions() {
      setAreBiophysicalInterventionsLoading(true)
      axios
        .get(interventionAnswersUrl)
        .then((response) => {
          setAreBiophysicalInterventionsLoading(false)
          setBiophysicalInterventions(getBiophysicalInterventions(response))
        })
        .catch(() => {
          setAreBiophysicalInterventionsLoading(false)
          toast.error(language.error.apiLoad)
        })
    },
    [interventionAnswersUrl]
  )

  useInitializeMonitoringForm({
    apiUrl: monitoringFormSingularUrl,
    questionMapping: questionMapping.ecologicalStatusAndOutcomes,
    resetForm,
    setIsLoading: setIsMainFormDataLoading,
    isEditMode
  })

  const createNewMonitoringForm = (payload) => {
    axios
      .post(monitoringFormsUrl, payload)
      .then(({ data }) => {
        setIsSubmitting(false)
        toast.success(language.success.getCreateThingSuccessMessage('This form'))
        navigate(data.id)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const editMonitoringForm = (payload) => {
    axios
      .put(monitoringFormSingularUrl, payload)
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.getEditThingSuccessMessage('This form'))
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    const payload = {
      form_type: MONITORING_FORM_TYPES.ecologicalStatusAndOutcomes,
      answers: mapDataForApi('ecologicalStatusAndOutcomes', formData)
    }

    if (isEditMode) {
      editMonitoringForm(payload)
    } else {
      createNewMonitoringForm(payload)
    }
  }

  return isMainFormDataLoading || areBiophysicalInterventionsLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.ecologicalStatusOutcomes}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='ecological-status-and-outcomes'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.dateOfEcologicalMonitoring.question}</StickyFormLabel>
          <Controller
            name='monitoringStartDate'
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='monitoring-start-date'
                    label='Monitoring start date'
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
          <ErrorText>{errors.monitoringStartDate?.message}</ErrorText>
          <QuestionSubSection>
            <Controller
              name='monitoringEndDate'
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                  <Stack spacing={3}>
                    <MobileDatePicker
                      id='monitoring-end-date'
                      label='Monitoring end date'
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
            <ErrorText>{errors.monitoringEndDate?.message}</ErrorText>
          </QuestionSubSection>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='ecologicalMonitoringStakeholders'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.ecologicalMonitoringStakeholders.options}
            question={questions.ecologicalMonitoringStakeholders.question}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.ecologicalMonitoringStakeholders?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.mangroveAreaIncrease.question}</StickyFormLabel>
          <Controller
            name='mangroveAreaIncrease'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveAreaIncrease.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveAreaIncrease?.message}</ErrorText>
        </FormQuestionDiv>
        {/* TABULAR INPUT GROUP SECTION 10.3A */}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.mangroveConditionImprovement.question}</StickyFormLabel>
          <Controller
            name='mangroveConditionImprovement'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveConditionImprovement.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveConditionImprovement?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.naturalRegenerationOnSite.question}</StickyFormLabel>
          <Controller
            name='naturalRegenerationOnSite'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.naturalRegenerationOnSite.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.naturalRegenerationOnSite?.message}</ErrorText>
        </FormQuestionDiv>
        {biophysicalInterventions.selectedValues?.length > 0 &&
        biophysicalInterventions.selectedValues.includes('Planting') ? (
          <div>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.percentageSurvival.question}</StickyFormLabel>
              <Controller
                name='percentageSurvival'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='Percentage'></TextField>
                )}
              />
              <ErrorText>{errors.percentageSurvival?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='causeOfLowSurvival'
                reactHookFormInstance={reactHookFormInstance}
                options={questions.causeOfLowSurvival.options}
                question={questions.causeOfLowSurvival.question}
                shouldAddOtherOptionWithClarification={true}
              />
              <ErrorText>{errors.causeOfLowSurvival?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
          </div>
        ) : null}
        {/* TABULAR INPUT GROUP SECTION 10.7 */}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.achievementOfEcologicalAims.question}</StickyFormLabel>
          <Controller
            name='achievementOfEcologicalAims'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.achievementOfEcologicalAims.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.achievementOfEcologicalAims?.message}</ErrorText>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

export default EcologicalStatusAndOutcomesForm
