import { useState, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import {
  Box,
  Checkbox,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'

import { ContentWrapper } from '../styles/containers'
import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  SectionFormTitle,
  StickyFormLabel
} from '../styles/forms'
import { ErrorText, Link } from '../styles/typography'
import language from '../language'
import { questionMapping } from '../data/questionMapping'
import { siteInterventions as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ButtonSubmit } from '../styles/buttons'
import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '../validation/multiSelectWithOther'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import LoadingIndicator from './LoadingIndicator'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { findDataItem } from '../library/findDataItem'

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2a') ?? []

function SiteInterventionsForm() {
  const validationSchema = yup.object({
    whichStakeholdersInvolved: multiselectWithOtherValidation,
    biophysicalInterventionsUsed: yup.array().of(
      yup.object().shape({
        interventionType: yup.string(),
        interventionStartDate: yup.string(),
        interventionEndDate: yup.string()
      })
    ),
    //   .min(1)
    //   .required('Select at least one intervention'),
    localParticipantTraining: yup.string(),
    organizationsProvidingTraining: multiselectWithOtherValidationNoMinimum,
    otherActivitiesImplemented: multiselectWithOtherValidation
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

    console.log({ formData })

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
    const biophysicalInterventionTypesCheckedCopy = biophysicalInterventionTypesChecked

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

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>Site Interventions</SectionFormTitle>
        <Link to={-1}>&larr; {language.form.navigateBackToSiteOverview}</Link>
      </FormPageHeader>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <CheckboxGroupWithLabelAndController
          fieldName='whichStakeholdersInvolved'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.whichStakeholdersInvolved.options}
          question={questions.whichStakeholdersInvolved.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.whichStakeholdersInvolved?.selectedValues?.message}</ErrorText>

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
          <div>
            <CheckboxGroupWithLabelAndController
              fieldName='organizationsProvidingTraining'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.organizationsProvidingTraining.options}
              question={questions.organizationsProvidingTraining.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>{errors.organizationsProvidingTraining?.selectedValues?.message}</ErrorText>
          </div>
        ) : null}
        <CheckboxGroupWithLabelAndController
          fieldName='otherActivitiesImplemented'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.otherActivitiesImplemented.options}
          question={questions.otherActivitiesImplemented.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.otherActivitiesImplemented?.selectedValues?.message}</ErrorText>

        {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </Form>
    </ContentWrapper>
  )
}

export default SiteInterventionsForm
