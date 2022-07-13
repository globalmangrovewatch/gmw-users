import {
  Box,
  Checkbox,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { styled } from '@mui/material/styles'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  SectionFormSubtitle,
  SectionFormTitle,
  StickyFormLabel
} from '../styles/forms'
import { ContentWrapper } from '../styles/containers'
import { ErrorText } from '../styles/typography'
import { findDataItem } from '../library/findDataItem'
import { mapDataForApi } from '../library/mapDataForApi'
import { multiselectWithOtherValidationNoMinimum } from '../validation/multiSelectWithOther'
import { questionMapping } from '../data/questionMapping'
import { siteInterventions as questions } from '../data/questions'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import QuestionNav from './QuestionNav'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import useSiteInfo from '../library/useSiteInfo'

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2a') ?? []

function SiteInterventionsForm() {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    whichStakeholdersInvolved: multiselectWithOtherValidationNoMinimum,
    biophysicalInterventionsUsed: yup.array().of(
      yup.object().shape({
        interventionType: yup.string(),
        interventionStartDate: yup.string(),
        interventionEndDate: yup.string()
      })
    ),
    localParticipantTraining: yup.string(),
    organizationsProvidingTraining: multiselectWithOtherValidationNoMinimum,
    otherActivitiesImplemented: multiselectWithOtherValidationNoMinimum
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      whichStakeholdersInvolved: { selectedValues: [], otherValue: undefined },
      organizationsProvidingTraining: { selectedValues: [], otherValue: undefined },
      otherActivitiesImplemented: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm,
    watch: watchForm,
    control
  } = reactHookFormInstance

  const {
    fields: biophysicalInterventionsFields,
    append: biophysicalInterventionsAppend,
    remove: biophysicalInterventionsRemove
  } = useFieldArray({ name: 'biophysicalInterventionsUsed', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [biophysicalInterventionTypesChecked, setBiophysicalInterventionTypesChecked] = useState([])
  const localParticipantTrainingWatcher = watchForm('localParticipantTraining')

  const setInitialBiophysicalInterventionTypesFromServerData = useCallback((serverResponse) => {
    const biophysicalInterventionsInitialVal = getBiophysicalInterventions(serverResponse)

    const initialBiophysicalInterventionsTypesChecked = biophysicalInterventionsInitialVal?.map(
      (intervention) => intervention.interventionType
    )
    setBiophysicalInterventionTypesChecked(initialBiophysicalInterventionsTypesChecked)
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.siteInterventions,
    resetForm,
    setIsLoading,
    successCallback: setInitialBiophysicalInterventionTypesFromServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('siteInterventions', formData))
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

  const handleBiophysicalInterventionsOnChange = (event, intervention) => {
    const biophysicalInterventionTypesCheckedCopy = [...biophysicalInterventionTypesChecked]

    if (event.target.checked) {
      biophysicalInterventionsAppend({
        interventionType: intervention,
        interventionStartDate: '',
        interventionEndDate: ''
      })
      biophysicalInterventionTypesCheckedCopy.push(intervention)
    } else {
      const fieldIndex = biophysicalInterventionsFields.findIndex(
        (field) => field.interventionType === intervention
      )
      const typeIndex = biophysicalInterventionTypesCheckedCopy.findIndex(
        (type) => type === intervention
      )
      biophysicalInterventionTypesCheckedCopy.splice(typeIndex, 1)
      biophysicalInterventionsRemove(fieldIndex)
    }
    setBiophysicalInterventionTypesChecked(biophysicalInterventionTypesCheckedCopy)
  }

  const getBiophysicalIntervention = (intervention) =>
    biophysicalInterventionsFields.find((field) => field.interventionType === intervention)

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>
          {language.pages.siteQuestionsOverview.formName.siteInterventions}
        </SectionFormTitle>
        <SectionFormSubtitle>{site_name}</SectionFormSubtitle>
      </FormPageHeader>
      <QuestionNav
        isSaving={isSubmitting}
        isSaveError={isSubmitError}
        onSave={validateInputs(handleSubmit)}
        currentSection='site-interventions'
      />
      <Form>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='whichStakeholdersInvolved'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.whichStakeholdersInvolved.options}
            question={questions.whichStakeholdersInvolved.question}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.whichStakeholdersInvolved?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.biophysicalInterventionsUsed.question}</StickyFormLabel>
          <List>
            {questions.biophysicalInterventionsUsed.options.map(
              (biophysicalIntervention, index) => (
                <ListItem key={index}>
                  <Box>
                    <Box>
                      <Checkbox
                        value={biophysicalIntervention}
                        checked={biophysicalInterventionTypesChecked.includes(
                          biophysicalIntervention
                        )}
                        onChange={(event) =>
                          handleBiophysicalInterventionsOnChange(event, biophysicalIntervention)
                        }></Checkbox>
                      <Typography variant='subtitle'>{biophysicalIntervention}</Typography>
                    </Box>
                    <Box>
                      {getBiophysicalIntervention(biophysicalIntervention) && (
                        <Box>
                          <InnerFormDiv>
                            <Controller
                              name={`biophysicalInterventionsUsed.${biophysicalInterventionsFields.findIndex(
                                (field) => field.interventionType === biophysicalIntervention
                              )}.interventionStartDate`}
                              control={control}
                              defaultValue={new Date()}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                  {...field}
                                  ref={null}>
                                  <Stack spacing={3}>
                                    <MobileDatePicker
                                      id='start-date'
                                      label='Intervention start date'
                                      value={field.value}
                                      onChange={(newValue) => {
                                        field.onChange(newValue)
                                      }}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Stack>
                                </LocalizationProvider>
                              )}
                            />
                          </InnerFormDiv>
                          <InnerFormDiv>
                            <Controller
                              name={`biophysicalInterventionsUsed.${biophysicalInterventionsFields.findIndex(
                                (field) => field.interventionType === biophysicalIntervention
                              )}.interventionEndDate`}
                              control={control}
                              defaultValue={new Date()}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                  {...field}
                                  ref={null}>
                                  <Stack spacing={3}>
                                    <MobileDatePicker
                                      id='end-date'
                                      label='Intervention end date'
                                      value={field.value}
                                      onChange={(newValue) => {
                                        field.onChange(newValue)
                                      }}
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                                  </Stack>
                                </LocalizationProvider>
                              )}
                            />
                          </InnerFormDiv>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </ListItem>
              )
            )}
          </List>
          <ErrorText>{errors.biophysicalInterventionsUsed?.message}</ErrorText>
        </FormQuestionDiv>

        <FormQuestionDiv>
          <FormLabel>{questions.localParticipantTraining.question}</FormLabel>
          <Controller
            name='localParticipantTraining'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.localParticipantTraining.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.localParticipantTraining?.message}</ErrorText>
        </FormQuestionDiv>

        {localParticipantTrainingWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='organizationsProvidingTraining'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.organizationsProvidingTraining.options}
              question={questions.organizationsProvidingTraining.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>{errors.organizationsProvidingTraining?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='otherActivitiesImplemented'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.otherActivitiesImplemented.options}
            question={questions.otherActivitiesImplemented.question}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.otherActivitiesImplemented?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

export default SiteInterventionsForm

const InnerFormDiv = styled('div')`
  margin-top: 1em;
  margin-left: 0.75em;
  max-width: 15em;
`
