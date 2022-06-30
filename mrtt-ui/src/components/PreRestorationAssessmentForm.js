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
  FormQuestionDiv,
  MainFormDiv,
  SectionFormTitle,
  SelectedInputSection,
  TabularInputSection,
  TabularLabel
} from '../styles/forms'
import { questionMapping } from '../data/questionMapping'
import { preRestorationAssessment as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ButtonSubmit } from '../styles/buttons'
import { ErrorText } from '../styles/typography'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidation } from '../validation/multiSelectWithOther'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import LoadingIndicator from './LoadingIndicator'
import { mangroveSpeciesPerCountryList } from '../data/mangroveSpeciesPerCountry'
import language from '../language'

const getSiteCountries = (registrationAnswersFromServer) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === '1.2')
    ?.answer_value ?? []

const getMangroveSpecies = (registrationAnswersFromServer) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === '5.3e')
    ?.answer_value ?? []

function PreRestorationAssessmentForm() {
  const validationSchema = yup.object().shape({
    mangrovesPreviouslyOccured: yup.string().required('This field is required'),
    mangroveRestorationAttempted: yup.string().required('This field is required'),
    lastRestorationAttemptYear: yup.mixed().when(' mangroveRestorationAttempted', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    }),
    previousBiophysicalInterventions: multiselectWithOtherValidation,
    whyUnsuccessfulRestorationAttempt: multiselectWithOtherValidation,
    siteAssessmentBeforeProject: yup.string().required('This field is required'),
    siteAssessmentType: multiselectWithOtherValidation,
    referenceCite: yup.string().required('This field is required'),
    lostMangrovesYear: yup.mixed().when('siteAssessmentBeforeProject', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    }),
    naturalRegenerationAtSite: yup.string(),
    mangroveSpeciesPresent: yup.array().of(yup.string()),
    speciesComposition: yup
      .array()
      .of(
        yup.object().shape({
          mangroveSpeciesType: yup.mixed(),
          percentageComposition: yup.number().nullable()
        })
      )
      .default([]),
    physicalMeasurementsTaken: yup.object().shape({
      tidalRange: yup.mixed(),
      elevationToSeaLevel: yup.mixed(),
      waterSalinity: yup.mixed(),
      soilPoreWaterSalinity: yup.mixed(),
      waterPH: yup.mixed(),
      soilPoreWaterPH: yup.mixed(),
      soilType: yup.mixed(),
      soilOrganicMatter: yup.mixed()
    }),
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
    setValue,
    watch
  } = reactHookFormInstance

  const {
    fields: speciesCompositionFields,
    append: speciesCompositionAppend,
    remove: speciesCompositionRemove
    // update: speciesCompositionUpdate
  } = useFieldArray({ name: 'speciesComposition', control })

  const mangroveRestorationAttemptedWatcher = watch('mangroveRestorationAttempted')
  const siteAssessmentBeforeProjectWatcher = watch('siteAssessmentBeforeProject')
  const speciesCompositionWatcher = watch('speciesComposition')
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mangroveSpeciesForCountriesSelected, setMangroveSpeciesForCountriesSelected] = useState([])
  const [mangroveSpeciesTypesChecked, setMangroveSpeciesTypesChecked] = useState([])
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`

  const loadSiteCountriesAndSetSpeciesFromServerData = useCallback((serverResponse) => {
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
  }, [])

  const loadMangroveSpeciesFromServerData = useCallback((serverResponse) => {
    setMangroveSpeciesTypesChecked(getMangroveSpecies(serverResponse))
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.preRestorationAssessment,
    resetForm,
    setIsLoading,
    successCallback: loadSiteCountriesAndSetSpeciesFromServerData,
    secondSuccessCallback: loadMangroveSpeciesFromServerData
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
    setValue('mangroveSpeciesPresent', mangroveSpeciesTypesCheckedCopy)
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      <SectionFormTitle>Pre-restoration Assessment</SectionFormTitle>
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
              <FormLabel>{questions.referenceCite.question}</FormLabel>
              <Controller
                name='referenceCite'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.referenceCite.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.referenceCite?.message}</ErrorText>
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
                {mangroveSpeciesForCountriesSelected.map((specie, index) => (
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
                ))}
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
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[0]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.tidalRange`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[1]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.elevationToSeaLevel`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[2]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.waterSalinity`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[3]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilPoreWaterSalinity`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[4]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.waterPH`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[5]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilPoreWaterPH`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[6]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilType`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>{questions.physicalMeasurementsTaken.options[7]}</TabularLabel>
              <Controller
                name={`physicalMeasurementsTaken.soilOrganicMatter`}
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='value'></TextField>
                )}
              />
            </TabularInputSection>
            <ErrorText>{errors.physicalMeasurementsTaken?.message}</ErrorText>
            <Button>+ Add measurement row</Button>
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
