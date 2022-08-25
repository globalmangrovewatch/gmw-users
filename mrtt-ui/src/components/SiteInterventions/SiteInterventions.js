import {
  Box,
  Button,
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

import { Form, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../../styles/forms'
import { ContentWrapper } from '../../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { findDataItem } from '../../library/findDataItem'
import { mapDataForApi } from '../../library/mapDataForApi'
import { multiselectWithOtherValidationNoMinimum } from '../../validation/multiSelectWithOther'
import { questionMapping } from '../../data/questionMapping'
import { siteInterventions as questions } from '../../data/questions'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { mangroveSpeciesPerCountryList } from '../../data/mangroveSpeciesPerCountry'
import { propaguleOptions, seedlingOptions } from '../../data/siteInterventionOptions'
import language from '../../language'
import LoadingIndicator from '../LoadingIndicator'
import QuestionNav from '../QuestionNav'
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'
import useSiteInfo from '../../library/useSiteInfo'
import AddMangroveAssociatedSpeciesRow from './AddMangroveAssociatedSpeciesRow'
import MangroveAssociatedSpeciesRow from './MangroveAssociatedSpeciesRow'

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2a') ?? []

const getSiteCountries = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '1.2') ?? []

const getMangroveSpeciesUsed = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2b') ?? []

function SiteInterventionsForm() {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    whichStakeholdersInvolved: multiselectWithOtherValidationNoMinimum,
    biophysicalInterventionsUsed: yup
      .array()
      .of(
        yup.object().shape({
          interventionType: yup.string(),
          interventionStartDate: yup.string(),
          interventionEndDate: yup.string()
        })
      )
      .default([]),
    mangroveSpeciesUsed: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string(),
          seed: yup
            .object()
            .shape({ checked: yup.bool(), source: yup.string(), count: yup.mixed() }),
          propagule: yup
            .object()
            .shape({ checked: yup.bool(), source: yup.string(), count: yup.mixed() })
        })
      )
      .default([]),
    mangroveAssociatedSpecies: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string(),
          count: yup.mixed(),
          source: yup.string(),
          purpose: yup.object().shape({ purpose: yup.string(), other: yup.string() })
        })
      )
      .default([]),
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
    remove: mangroveSpeciesUsedRemove,
    update: mangroveSpeciesUsedUpdate
  } = useFieldArray({ name: 'mangroveSpeciesUsed', control })

  const {
    fields: mangroveAssociatedSpeciesFields,
    append: mangroveAssociatedSpeciesAppend,
    remove: mangroveAssociatedSpeciesRemove,
    update: mangroveAssociatedSpeciesUpdate
  } = useFieldArray({ name: 'mangroveAssociatedSpecies', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [biophysicalInterventionTypesChecked, setBiophysicalInterventionTypesChecked] = useState([])
  const [mangroveSpeciesForCountriesSelected, setMangroveSpeciesForCountriesSelected] = useState([])
  const [mangroveSpeciesUsedChecked, setMangroveSpeciesUsedChecked] = useState([])
  const [showAddTabularInputRow, setShowAddTabularInputRow] = useState(false)
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

    const getMangroveSpeciesUsedFrom6_2b = getMangroveSpeciesUsed(serverResponse)
    let mangroveSpeciesList = []
    if (getMangroveSpeciesUsedFrom6_2b.length) {
      mangroveSpeciesList = getMangroveSpeciesUsedFrom6_2b.map((specie) => specie.type)
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

    if (!formData) return

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
    const mangroveSpeciesUsedCheckedCopy = [...mangroveSpeciesUsedChecked]

    if (event.target.checked) {
      mangroveSpeciesUsedAppend({
        type: specie,
        seed: { checked: false, source: '', count: 0 },
        propagule: { checked: false, source: '', count: 0 }
      })
      mangroveSpeciesUsedCheckedCopy.push(specie)
    } else {
      const fieldIndex = mangroveSpeciesUsedFields.findIndex((field) => field.type === specie)
      const typeIndex = mangroveSpeciesUsedCheckedCopy.findIndex((type) => type === specie)
      mangroveSpeciesUsedCheckedCopy.splice(typeIndex, 1)
      mangroveSpeciesUsedRemove(fieldIndex)
    }
    setMangroveSpeciesUsedChecked(mangroveSpeciesUsedCheckedCopy)
  }
  const getMangroveSpeciesUsedIndex = (specie) => {
    return mangroveSpeciesUsedFields.findIndex((item) => item.type === specie)
  }

  const handleSourceOfSeedlingsOnChange = (event, specie, seedlingType) => {
    const index = getMangroveSpeciesUsedIndex(specie)
    const item = mangroveSpeciesUsedFields[index]
    if (seedlingType === 'seedling') {
      event.target.checked ? (item.seed.checked = true) : (item.seed.checked = false)
    } else if (seedlingType === 'propagule') {
      event.target.checked ? (item.propagule.checked = true) : (item.propagule.checked = false)
    }
    mangroveSpeciesUsedUpdate(item)
  }

  const isMangroveSpeciesUsedShowing = () => {
    const optionsUsed = [
      'Planting',
      'Broadcast collected propagules onto an incoming tide',
      'Large scale broadcasting of propagules from the air or boats'
    ]

    const matchingItems = optionsUsed.filter((item) =>
      biophysicalInterventionTypesChecked.includes(item)
    )

    return matchingItems.length ? true : false
  }

  const updateTabularInputDisplay = (boolean) => {
    return setShowAddTabularInputRow(boolean)
  }

  const saveItem = ({ type, count, source, purpose }) => {
    mangroveAssociatedSpeciesAppend({
      type,
      count,
      source,
      purpose
    })
  }

  const deleteMeasurementItem = (measurementIndex) => {
    mangroveAssociatedSpeciesRemove(measurementIndex)
  }

  const updateMeasurementItem = (measurementIndex, count, source, purpose, otherPurpose) => {
    const currentItem = mangroveAssociatedSpeciesFields[measurementIndex]
    if (count) currentItem.count = count
    if (source) currentItem.source = source
    if (purpose) currentItem.purpose.purpose = purpose
    if (otherPurpose) currentItem.purpose.other = otherPurpose
    mangroveAssociatedSpeciesUpdate(measurementIndex, currentItem)
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
                                        field.onChange(newValue?.toISOString())
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
                                        field.onChange(newValue?.toISOString())
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

        {isMangroveSpeciesUsedShowing() ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.mangroveSpeciesUsed.question}</StickyFormLabel>
            <List>
              {mangroveSpeciesForCountriesSelected.length ? (
                mangroveSpeciesForCountriesSelected.map((specie, specieSelectedIndex) => (
                  <ListItem key={specieSelectedIndex}>
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
                      {mangroveSpeciesUsedChecked.includes(specie) ? (
                        <SubgroupDiv>
                          <Typography>{questions.sourceOfMangroves.question}</Typography>
                          <Box>
                            <Checkbox
                              value={specie}
                              checked={
                                mangroveSpeciesUsedFields[getMangroveSpeciesUsedIndex(specie)].seed
                                  .checked
                              }
                              onChange={(event) =>
                                handleSourceOfSeedlingsOnChange(event, specie, 'seedling')
                              }></Checkbox>
                            <Typography variant='subtitle'>Seedling</Typography>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.seed.source`}
                                control={control}
                                defaultValue=''
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    select
                                    value={field.value}
                                    label='Source'
                                    sx={{ minWidth: '10em' }}>
                                    {seedlingOptions.map((item, index) => (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            </SubgroupDiv>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.seed.count`}
                                control={control}
                                defaultValue=''
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    value={field.value}
                                    label='Count'
                                    sx={{ width: '10em', marginTop: '1em' }}></TextField>
                                )}
                              />
                            </SubgroupDiv>
                          </Box>
                          <Box>
                            <Checkbox
                              value={specie}
                              checked={
                                mangroveSpeciesUsedFields[getMangroveSpeciesUsedIndex(specie)]
                                  .propagule.checked
                              }
                              onChange={(event) =>
                                handleSourceOfSeedlingsOnChange(event, specie, 'propagule')
                              }></Checkbox>
                            <Typography variant='subtitle'>Propagule</Typography>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.propagule.source`}
                                control={control}
                                defaultValue=''
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    select
                                    value={field.value}
                                    label='Source'
                                    sx={{ minWidth: '10em' }}>
                                    {propaguleOptions.map((item, index) => (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                )}
                              />
                            </SubgroupDiv>
                            <SubgroupDiv>
                              <Controller
                                name={`mangroveSpeciesUsed.${getMangroveSpeciesUsedIndex(
                                  specie
                                )}.propagule.count`}
                                control={control}
                                defaultValue=''
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    value={field.value}
                                    label='Count'
                                    sx={{ width: '10em', marginTop: '1em' }}></TextField>
                                )}
                              />
                            </SubgroupDiv>
                          </Box>
                        </SubgroupDiv>
                      ) : null}
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
        ) : null}
        {isMangroveSpeciesUsedShowing ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.mangroveAssociatedSpecies.question}</StickyFormLabel>
            {mangroveAssociatedSpeciesFields.length > 0
              ? mangroveAssociatedSpeciesFields.map((item, itemIndex) => (
                  <MangroveAssociatedSpeciesRow
                    key={itemIndex}
                    type={item.type}
                    count={item.count}
                    source={item.source}
                    purpose={item.purpose.purpose}
                    other={item.purpose.other}
                    index={itemIndex}
                    deleteItem={deleteMeasurementItem}
                    updateItem={updateMeasurementItem}></MangroveAssociatedSpeciesRow>
                ))
              : null}
            <ErrorText>{errors.mangroveAssociatedSpecies?.message}</ErrorText>
            {showAddTabularInputRow ? (
              <AddMangroveAssociatedSpeciesRow
                saveItem={saveItem}
                updateTabularInputDisplay={
                  updateTabularInputDisplay
                }></AddMangroveAssociatedSpeciesRow>
            ) : null}
            {!showAddTabularInputRow ? (
              <Button sx={{ marginTop: '1.5em' }} onClick={() => setShowAddTabularInputRow(true)}>
                + Add measurement row
              </Button>
            ) : null}
          </FormQuestionDiv>
        ) : null}
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

const SubgroupDiv = styled('div')`
  margin-left: 2.7em;
  margin-top: 0.5em;
`
