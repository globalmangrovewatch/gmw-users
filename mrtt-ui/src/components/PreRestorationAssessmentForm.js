import { useState, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  MainFormDiv,
  SectionFormTitle,
  SelectedInputSection,
  TabularLabel
} from '../styles/forms'
import { questionMapping } from '../data/questionMapping'
import { preRestorationAssessment as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ButtonSubmit } from '../styles/buttons'
import { ErrorText, Link } from '../styles/typography'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../validation/multiSelectWithOther'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import LoadingIndicator from './LoadingIndicator'
import { mangroveSpeciesPerCountryList } from '../data/mangroveSpeciesPerCountry'
import language from '../language'
import TabularInputRow from './TabularInput/TabularInputRow'
import AddTabularInputRow from './TabularInput/AddTabularInputRow'
import { findDataItem } from '../library/findDataItem'

const getSiteCountries = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '1.2') ?? []

const getMangroveSpecies = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '5.3e') ?? []

const getPhysicalMeasurementsTaken = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '5.3g') ?? []

function PreRestorationAssessmentForm() {
  const validationSchema = yup.object().shape({
    mangrovesPreviouslyOccured: yup.string(),
    mangroveRestorationAttempted: yup.string(),
    lastRestorationAttemptYear: yup.mixed().when(' mangroveRestorationAttempted', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    }),
    previousBiophysicalInterventions: multiselectWithOtherValidationNoMinimum,
    whyUnsuccessfulRestorationAttempt: multiselectWithOtherValidationNoMinimum,
    siteAssessmentBeforeProject: yup.string(),
    siteAssessmentType: multiselectWithOtherValidationNoMinimum,
    referenceSite: yup.string(),
    lostMangrovesYear: yup.mixed().when('siteAssessmentBeforeProject', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    }),
    naturalRegenerationAtSite: yup.string(),
    mangroveSpeciesPresent: yup.array().of(yup.string()).nullable(),
    speciesComposition: yup
      .array()
      .of(
        yup.object().shape({
          mangroveSpeciesType: yup.mixed(),
          percentageComposition: yup.array().nullable()
        })
      )
      .default([]),
    physicalMeasurementsTaken: yup.array().of(
      yup.object().shape({
        measurementType: yup.string(),
        measurementValue: yup.mixed(),
        measurementUnit: yup.string()
      })
    ),
    pilotTestConducted: yup.string(),
    guidanceForSiteRestoration: yup.string()
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      previousBiophysicalInterventions: { selectedValues: [], otherValue: undefined },
      whyUnsuccessfulRestorationAttempt: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })
  const {
    handleSubmit: validateInputs,
    formState: { errors },
    control,
    reset: resetForm,
    setValue: setFormValue,
    watch: watchForm
  } = reactHookFormInstance

  const {
    fields: speciesCompositionFields,
    append: speciesCompositionAppend,
    remove: speciesCompositionRemove
  } = useFieldArray({ name: 'speciesComposition', control })

  const {
    fields: physicalMeasurementsTakenFields,
    append: physicalMeasurementsTakenAppend,
    remove: physicalMeasurementsTakenRemove,
    replace: physicalMeasurementsTakenReplace,
    update: physicalMeasurementsTakenUpdate
  } = useFieldArray({ name: 'physicalMeasurementsTaken', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const mangroveRestorationAttemptedWatcher = watchForm('mangroveRestorationAttempted')
  const siteAssessmentBeforeProjectWatcher = watchForm('siteAssessmentBeforeProject')
  const speciesCompositionWatcher = watchForm('speciesComposition')
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mangroveSpeciesForCountriesSelected, setMangroveSpeciesForCountriesSelected] = useState([])
  const [mangroveSpeciesTypesChecked, setMangroveSpeciesTypesChecked] = useState([])
  const [showAddTabularInputRow, setShowAddTabularInputRow] = useState(false)

  const loadServerData = useCallback(
    (serverResponse) => {
      const defaultMeasurementsTaken = [
        { measurementType: 'Tidal range' },
        { measurementType: 'Elevation to sea level' },
        { measurementType: 'Water salinity' },
        { measurementType: 'Soil pore water salinity' },
        { measurementType: 'Water PH' },
        { measurementType: 'Soil pore water PH' },
        { measurementType: 'Soil type' },
        { measurementType: 'Soil organic matter' }
      ]

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
      setMangroveSpeciesTypesChecked(getMangroveSpecies(serverResponse))

      const physicalMeasurementsTakenInitialVal = getPhysicalMeasurementsTaken(serverResponse)

      if (physicalMeasurementsTakenInitialVal.length === 0) {
        physicalMeasurementsTakenReplace(defaultMeasurementsTaken)
      }
    },
    [physicalMeasurementsTakenReplace]
  )

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.preRestorationAssessment,
    resetForm,
    setIsLoading,
    successCallback: loadServerData
  })

  const handleSubmit = async (formData) => {
    setisSubmitting(true)
    setIsError(false)

    if (!formData) return

    axios
      .patch(apiAnswersUrl, mapDataForApi('preRestorationAssessment', formData))
      .then(() => {
        setisSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
        toast.error(language.error.submit)
      })
  }

  const handleMangroveSpeciesPresentOnChange = (event, specie) => {
    const mangroveSpeciesTypesCheckedCopy = mangroveSpeciesTypesChecked
    if (event.target.checked) {
      speciesCompositionAppend({ mangroveSpeciesType: specie, percentageComposition: '' })
      mangroveSpeciesTypesCheckedCopy.push(specie)
    } else {
      const fieldIndex = speciesCompositionFields.findIndex(
        (field) => field.mangroveSpeciesType === specie
      )
      const typeIndex = mangroveSpeciesTypesCheckedCopy.findIndex((type) => type === specie)
      mangroveSpeciesTypesCheckedCopy.splice(typeIndex, 1)
      speciesCompositionRemove(fieldIndex)
    }
    setMangroveSpeciesTypesChecked(mangroveSpeciesTypesCheckedCopy)
    setFormValue('mangroveSpeciesPresent', mangroveSpeciesTypesCheckedCopy)
  }

  const updateTabularInputDisplay = (boolean) => {
    return setShowAddTabularInputRow(boolean)
  }

  const saveMeasurementItem = (measurementType, measurementValue) => {
    physicalMeasurementsTakenAppend({
      measurementType,
      measurementValue
    })
  }

  const deleteMeasurementItem = (measurementIndex) => {
    physicalMeasurementsTakenRemove(measurementIndex)
  }

  const updateMeasurementItem = (measurementIndex, value, unit) => {
    const currentItem = physicalMeasurementsTakenFields[measurementIndex]
    if (value) currentItem.measurementValue = value
    if (unit) currentItem.measurementUnit = unit
    physicalMeasurementsTakenUpdate(measurementIndex, currentItem)
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      <FormPageHeader>
        <SectionFormTitle>Pre Restoration Assessment Form</SectionFormTitle>
        <Link to={-1}>&larr; {language.form.navigateBackToSiteOverview}</Link>
      </FormPageHeader>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormQuestionDiv>
          <FormLabel>{questions.mangrovesPreviouslyOccured.question}</FormLabel>
          <Controller
            name='mangrovesPreviouslyOccured'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangrovesPreviouslyOccured.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangrovesPreviouslyOccured?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.mangroveRestorationAttempted.question}</FormLabel>
          <Controller
            name='mangroveRestorationAttempted'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveRestorationAttempted.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveRestorationAttempted?.message}</ErrorText>
        </FormQuestionDiv>
        {mangroveRestorationAttemptedWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <FormLabel>{questions.lastRestorationAttemptYear.question}</FormLabel>
            <Controller
              name='lastRestorationAttemptYear'
              control={control}
              defaultValue={''}
              render={({ field }) => (
                <TextField {...field} value={field.value} label='enter year'></TextField>
              )}
            />
            <ErrorText>{errors.lastRestorationAttemptYear?.message}</ErrorText>
            <CheckboxGroupWithLabelAndController
              fieldName='previousBiophysicalInterventions'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.previousBiophysicalInterventions.options}
              question={questions.previousBiophysicalInterventions.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>
              {errors.previousBiophysicalInterventions?.selectedValues?.message}
            </ErrorText>
            <CheckboxGroupWithLabelAndController
              fieldName='whyUnsuccessfulRestorationAttempt'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.whyUnsuccessfulRestorationAttempt.options}
              question={questions.whyUnsuccessfulRestorationAttempt.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>
              {errors.whyUnsuccessfulRestorationAttempt?.selectedValues?.message}
            </ErrorText>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <FormLabel>{questions.siteAssessmentBeforeProject.question}</FormLabel>
          <Controller
            name='siteAssessmentBeforeProject'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.siteAssessmentBeforeProject.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.siteAssessmentBeforeProject?.message}</ErrorText>
        </FormQuestionDiv>
        {siteAssessmentBeforeProjectWatcher === 'Yes' ? (
          <div>
            <CheckboxGroupWithLabelAndController
              fieldName='siteAssessmentType'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.siteAssessmentType.options}
              question={questions.siteAssessmentType.question}
              shouldAddOtherOptionWithClarification={false}
            />
            <ErrorText>{errors.siteAssessmentType?.selectedValues?.message}</ErrorText>
            <FormQuestionDiv>
              <FormLabel>{questions.referenceSite.question}</FormLabel>
              <Controller
                name='referenceSite'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.referenceSite.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.referenceSite?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <FormLabel>{questions.lostMangrovesYear.question}</FormLabel>
              <Controller
                name='lostMangrovesYear'
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='enter year'></TextField>
                )}
              />
              <ErrorText>{errors.lostMangrovesYear?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <FormLabel>{questions.naturalRegenerationAtSite.question}</FormLabel>
              <Controller
                name='naturalRegenerationAtSite'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.naturalRegenerationAtSite.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.naturalRegenerationAtSite?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <FormLabel>{questions.mangroveSpeciesPresent.question}</FormLabel>
              <List>
                {mangroveSpeciesForCountriesSelected.length ? (
                  mangroveSpeciesForCountriesSelected.map((specie, index) => (
                    <ListItem key={index}>
                      <Box>
                        <Box>
                          <Checkbox
                            value={specie}
                            checked={mangroveSpeciesTypesChecked.includes(specie)}
                            onChange={(event) =>
                              handleMangroveSpeciesPresentOnChange(event, specie)
                            }></Checkbox>
                          <Typography variant='subtitle'>{specie}</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <ErrorText>
                    No items to display. Please select countries in Site Details and Location (1.2).
                  </ErrorText>
                )}
              </List>
              <ErrorText>{errors.mangroveSpeciesPresent?.message}</ErrorText>
            </FormQuestionDiv>
          </div>
        ) : null}
        {mangroveSpeciesTypesChecked.length > 0 ? (
          <FormQuestionDiv>
            <FormLabel>{questions.speciesComposition.question}</FormLabel>
            {speciesCompositionWatcher?.map((mangroveSpecie, mangroveSpecieIndex) => {
              return (
                <SelectedInputSection key={mangroveSpecieIndex}>
                  <FormLabel>{mangroveSpecie.mangroveSpeciesType}</FormLabel>
                  <Controller
                    name={`speciesComposition.${mangroveSpecieIndex}.percentageComposition`}
                    control={control}
                    defaultValue={''}
                    render={({ field }) => (
                      <TextField {...field} sx={{ maxWidth: '10em' }} label='% Number'></TextField>
                    )}
                  />
                </SelectedInputSection>
              )
            })}
            <ErrorText>{errors.speciesComposition?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}

        {siteAssessmentBeforeProjectWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <TabularLabel>{questions.physicalMeasurementsTaken.question}</TabularLabel>
            {physicalMeasurementsTakenFields.length > 0
              ? physicalMeasurementsTakenFields.map((measurementItem, measurementItemIndex) => (
                  <TabularInputRow
                    key={measurementItemIndex}
                    label={measurementItem.measurementType}
                    rowValue1={measurementItem.measurementValue}
                    rowValue2={measurementItem.measurementUnit}
                    index={measurementItemIndex}
                    deleteMeasurementItem={deleteMeasurementItem}
                    updateMeasurementItem={updateMeasurementItem}></TabularInputRow>
                ))
              : null}
            <ErrorText>{errors.physicalMeasurementsTaken?.message}</ErrorText>
            {showAddTabularInputRow ? (
              <AddTabularInputRow
                saveMeasurementItem={saveMeasurementItem}
                updateTabularInputDisplay={updateTabularInputDisplay}></AddTabularInputRow>
            ) : null}
            {!showAddTabularInputRow ? (
              <Button onClick={() => setShowAddTabularInputRow(true)}>+ Add measurement row</Button>
            ) : null}
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <FormLabel>{questions.pilotTestConducted.question}</FormLabel>
          <Controller
            name='pilotTestConducted'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.pilotTestConducted.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.pilotTestConducted?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.guidanceForSiteRestoration.question}</FormLabel>
          <Controller
            name='guidanceForSiteRestoration'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.guidanceForSiteRestoration.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.guidanceForSiteRestoration?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </Form>
    </MainFormDiv>
  )
}

export default PreRestorationAssessmentForm
