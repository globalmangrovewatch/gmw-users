import { useState, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { styled } from '@mui/material/styles'
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

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
import { multiselectWithOtherValidationNoMinimum } from '../validation/multiSelectWithOther'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import LoadingIndicator from './LoadingIndicator'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { findDataItem } from '../library/findDataItem'
import { mangroveSpeciesPerCountryList } from '../data/mangroveSpeciesPerCountry'

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2a') ?? []

const getSiteCountries = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '1.2') ?? []

const getMangroveSpeciesUsed = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2b') ?? []

function SiteInterventionsForm() {
  const validationSchema = yup.object({
    whichStakeholdersInvolved: multiselectWithOtherValidationNoMinimum,
    biophysicalInterventionsUsed: yup.array().of(
      yup.object().shape({
        interventionType: yup.string(),
        interventionStartDate: yup.string(),
        interventionEndDate: yup.string()
      })
    ),
    mangroveSpeciesUsed: yup.array().of(
      yup.object().shape({
        mangroveSpeciesType: yup.string(),
        source: yup.string(),
        count: yup.number()
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

  const {
    fields: mangroveSpeciesUsedFields,
    append: mangroveSpeciesUsedAppend,
    remove: mangroveSpeciesUsedRemove
  } = useFieldArray({ name: 'mangroveSpeciesUsed', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [biophysicalInterventionTypesChecked, setBiophysicalInterventionTypesChecked] = useState([])
  const [mangroveSpeciesForCountriesSelected, setMangroveSpeciesForCountriesSelected] = useState([])
  const [mangroveSpeciesUsedChecked, setMangroveSpeciesUsedChecked] = useState([])
  const localParticipantTrainingWatcher = watchForm('localParticipantTraining')

  const loadServerData = useCallback((serverResponse) => {
    // set biophysical interventions
    const biophysicalInterventionsInitialVal = getBiophysicalInterventions(serverResponse)

    const initialBiophysicalInterventionsTypesChecked = biophysicalInterventionsInitialVal?.map(
      (intervention) => intervention.interventionType
    )
    setBiophysicalInterventionTypesChecked(initialBiophysicalInterventionsTypesChecked)

    // set countries list for countries selected in 1.2
    const siteCountriesResponse = getSiteCountries(serverResponse)

    if (siteCountriesResponse.length) {
      const countriesList = siteCountriesResponse.map(
        (countryItem) => countryItem.properties.country
      )
      const species = []
      countriesList.forEach((countrySelected) => {
        mangroveSpeciesPerCountryList.forEach((countryItem) => {
          if (countryItem.country.name === countrySelected) {
            species.push(...countryItem.species)
          }
        })
      })
      const uniqueSpecies = [...new Set(species)]

      setMangroveSpeciesForCountriesSelected(uniqueSpecies)
    }

    // set mangrove species list for items selected in 6.2b
    const mangroveSpeciesUsedResponse = getMangroveSpeciesUsed(serverResponse)
    let mangroveSpeciesList = []
    if (mangroveSpeciesUsedResponse.length) {
      mangroveSpeciesList = mangroveSpeciesUsedResponse.map((specie) => specie.mangroveSpeciesType)
    }
    setMangroveSpeciesUsedChecked(mangroveSpeciesList)
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.siteInterventions,
    resetForm,
    setIsLoading,
    successCallback: loadServerData
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

  const handleMangroveSpeciesUsedOnChange = (event, specie) => {
    const mangroveSpeciesUsedCheckedCopy = mangroveSpeciesUsedChecked

    if (event.target.checked) {
      mangroveSpeciesUsedAppend({
        mangroveSpeciesType: specie,
        source: '',
        count: 0
      })
      mangroveSpeciesUsedCheckedCopy.push(specie)
    } else {
      const fieldIndex = mangroveSpeciesUsedFields.findIndex(
        (field) => field.mangroveSpeciesType === specie
      )
      const typeIndex = mangroveSpeciesUsedCheckedCopy.findIndex((type) => type === specie)
      mangroveSpeciesUsedCheckedCopy.splice(typeIndex, 1)
      mangroveSpeciesUsedRemove(fieldIndex)
    }
    setMangroveSpeciesUsedChecked(mangroveSpeciesUsedCheckedCopy)
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>Site Interventions</SectionFormTitle>
        <Link to={`/sites/${siteId}/overview`}>{language.form.navigateBackToSiteOverview}</Link>
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
          <StickyFormLabel>{questions.mangroveSpeciesUsed.question}</StickyFormLabel>
          <List>
            {mangroveSpeciesForCountriesSelected.length ? (
              mangroveSpeciesForCountriesSelected.map((specie, index) => (
                <ListItem key={index}>
                  <Box>
                    <Box>
                      <Checkbox
                        value={specie}
                        checked={mangroveSpeciesUsedChecked.includes(specie)}
                        onChange={(event) =>
                          handleMangroveSpeciesUsedOnChange(event, specie)
                        }></Checkbox>
                      <Typography variant='subtitle'>{specie}</Typography>
                    </Box>
                    <Box></Box>
                  </Box>
                </ListItem>
              ))
            ) : (
              <ErrorText>
                No items to display. Please select countries in Site Details and Location (1.2).
              </ErrorText>
            )}
          </List>
          <ErrorText>{errors.mangroveSpeciesUsed?.message}</ErrorText>
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

const InnerFormDiv = styled('div')`
  margin-top: 1em;
  margin-left: 0.75em;
  max-width: 15em;
`
