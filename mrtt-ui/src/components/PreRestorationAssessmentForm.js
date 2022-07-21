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
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  StickyFormLabel,
  SectionFormSubtitle,
  SectionFormTitle,
  SelectedInputSection,
  TabularLabel
} from '../styles/forms'
import { ContentWrapper } from '../styles/containers'
import { ErrorText } from '../styles/typography'
import { findDataItem } from '../library/findDataItem'
import { mangroveSpeciesPerCountryList } from '../data/mangroveSpeciesPerCountry'
import { mapDataForApi } from '../library/mapDataForApi'
import { multiselectWithOtherValidationNoMinimum } from '../validation/multiSelectWithOther'
import { preRestorationAssessment as questions } from '../data/questions'
import { questionMapping } from '../data/questionMapping'
import AddTabularInputRow from './TabularInput/AddTabularInputRow'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import QuestionNav from './QuestionNav'
import TabularInputRow from './TabularInput/TabularInputRow'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import useSiteInfo from '../library/useSiteInfo'

const getSiteCountries = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '1.2') ?? []

const getMangroveSpecies = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '5.3e') ?? []

const getPhysicalMeasurementsTaken = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '5.3g') ?? []

function PreRestorationAssessmentForm() {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object().shape({
    mangrovesPreviouslyOccured: yup.string(),
    mangroveRestorationAttempted: yup.string(),
    lastRestorationAttemptYear: yup.mixed().when(' mangroveRestorationAttempted', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError(language.form.error.noYearProvided)
        .min(1900, language.form.error.yearTooLow)
        .max(new Date().getFullYear(), language.form.error.yearTooHigh)
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
        .typeError(language.form.error.noYearProvided)
        .min(1900, language.form.error.yearTooLow)
        .max(new Date().getFullYear(), language.form.error.yearTooHigh)
    }),
    naturalRegenerationAtSite: yup.string(),
    mangroveSpeciesPresent: yup.array().of(yup.string()).nullable(),
    speciesComposition: yup
      .array()
      .of(
        yup.object().shape({
          mangroveSpeciesType: yup.mixed(),
          percentageComposition: yup.mixed()
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
    const mangroveSpeciesTypesCheckedCopy = [...mangroveSpeciesTypesChecked]
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
    <ContentWrapper>
      <FormPageHeader>
        <SectionFormTitle>
          {language.pages.siteQuestionsOverview.formName.preRestorationAssessment}
        </SectionFormTitle>
        <SectionFormSubtitle>{site_name}</SectionFormSubtitle>
      </FormPageHeader>
      <QuestionNav
        isSaving={isSubmitting}
        isSaveError={isError}
        onSave={validateInputs(handleSubmit)}
        currentSection='pre-restoration-assessment'
      />
      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.mangrovesPreviouslyOccured.question}</StickyFormLabel>
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
          <StickyFormLabel>{questions.mangroveRestorationAttempted.question}</StickyFormLabel>
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
          <>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.lastRestorationAttemptYear.question}</StickyFormLabel>
              <Controller
                name='lastRestorationAttemptYear'
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='year'></TextField>
                )}
              />
              <ErrorText>{errors.lastRestorationAttemptYear?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
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
            </FormQuestionDiv>
            <FormQuestionDiv>
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
          </>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.siteAssessmentBeforeProject.question}</StickyFormLabel>
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
          <>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='siteAssessmentType'
                reactHookFormInstance={reactHookFormInstance}
                options={questions.siteAssessmentType.options}
                question={questions.siteAssessmentType.question}
                shouldAddOtherOptionWithClarification={false}
              />
              <ErrorText>{errors.siteAssessmentType?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.referenceSite.question}</StickyFormLabel>
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
              <StickyFormLabel>{questions.lostMangrovesYear.question}</StickyFormLabel>
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
              <StickyFormLabel>{questions.naturalRegenerationAtSite.question}</StickyFormLabel>
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
              <StickyFormLabel>{questions.mangroveSpeciesPresent.question}</StickyFormLabel>
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
          </>
        ) : null}
        {mangroveSpeciesTypesChecked.length > 0 ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.speciesComposition.question}</StickyFormLabel>
            {speciesCompositionWatcher?.map((mangroveSpecie, mangroveSpecieIndex) => {
              return (
                <SelectedInputSection key={mangroveSpecieIndex}>
                  <FormLabel>{mangroveSpecie.mangroveSpeciesType}</FormLabel>
                  <Controller
                    name={`speciesComposition.${mangroveSpecieIndex}.percentageComposition`}
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField {...field} sx={{ maxWidth: '10em' }} label='% Number'></TextField>
                    )}
                  />
                </SelectedInputSection>
              )
            })}
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
          <StickyFormLabel>{questions.pilotTestConducted.question}</StickyFormLabel>
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
          <StickyFormLabel>{questions.guidanceForSiteRestoration.question}</StickyFormLabel>
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
      </Form>
    </ContentWrapper>
  )
}

export default PreRestorationAssessmentForm
