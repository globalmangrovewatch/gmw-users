import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import turfConvex from '@turf/convex'
import turfBbox from '@turf/bbox'
import turfBboxPolygon from '@turf/bbox-polygon'

import { ButtonSubmit } from '../styles/buttons'
import { ErrorText } from '../styles/typography'
import { MainFormDiv, FormQuestionDiv, SectionFormTitle, Form } from '../styles/forms'
import { mapDataForApi } from '../library/mapDataForApi'
import { projectDetails as questions } from '../data/questions'
import { questionMapping } from '../data/questionMapping'
import { useParams } from 'react-router-dom'
import emptyFeatureCollection from '../data/emptyFeatureCollection'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import mangroveCountries from '../data/mangrove_countries.json'
import ProjectAreaMap from './ProjectAreaMap'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'

const sortCountries = (a, b) => {
  const textA = a.properties.country.toUpperCase()
  const textB = b.properties.country.toUpperCase()

  return textA < textB ? -1 : textA > textB ? 1 : 0
}
const countriesGeojson = mangroveCountries.features.sort(sortCountries)
const siteAreaError = 'Please provide a site area'

function ProjectDetailsForm() {
  const [mapExtent, setMapExtent] = useState()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const validationSchema = yup.object().shape({
    hasProjectEndDate: yup.boolean(),
    projectStartDate: yup.string().required('Select a start date'),
    projectEndDate: yup.string().when('hasProjectEndDate', {
      is: true,
      then: yup.string().required('Please select an end date')
    }),
    countries: yup
      .array()
      .of(
        yup.object().shape({
          bbox: yup.array().of(yup.number()),
          geometry: yup.object().shape({
            coordinates: yup.array().of(yup.number()),
            type: yup.string()
          }),
          properties: yup.object().shape({
            country: yup.string(),
            mangroves: yup.string()
          })
        })
      )
      .min(1)
      .typeError('Select at least one country'),
    siteArea: yup
      .object()
      .shape({
        features: yup.array().min(1, siteAreaError).required(siteAreaError)
      })
      .required(siteAreaError)
  })
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      hasProjectEndDate: false,
      projectStartDate: undefined,
      projectEndDate: undefined,
      countries: undefined,
      siteArea: emptyFeatureCollection
    }
  }

  const { control, handleSubmit, formState, watch, reset: resetForm } = useForm(formOptions)
  const { errors } = formState
  const { siteId } = useParams()
  const registrationAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  let watchHasProjectEndDate = watch('hasProjectEndDate', false)
  /* showEndDateInput is a hack because MUI follows native html and casts values to strings.
   The api casts them to boolean so we support both */
  const showEndDateInput = watchHasProjectEndDate === 'true' || watchHasProjectEndDate === true

  useInitializeQuestionMappedForm({
    apiUrl: registrationAnswersUrl,
    resetForm,
    questionMapping: questionMapping.projectDetails,
    setIsLoading
  })

  const onCountriesChange = (field, features) => {
    try {
      field.onChange(features)
      if (features.length > 0) {
        const bboxFeatureCollection = {
          features: features.map((feature) => turfBboxPolygon(feature.bbox)),
          type: 'FeatureCollection'
        }
        const totalBbox = turfBbox(turfConvex(bboxFeatureCollection))
        setMapExtent(totalBbox)
      } else {
        setMapExtent(undefined)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onSiteAreaFeatureCollectionChange = (field, featureCollection) => {
    field.onChange(featureCollection)

    if (featureCollection.features && featureCollection.features.length) {
      setMapExtent(turfBbox(featureCollection))
    }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setIsError(false)
    const url = `${process.env.REACT_APP_API_URL}/sites/1/registration_answers`

    if (!data) return

    axios
      .patch(url, mapDataForApi('projectDetails', data))
      .then(() => {
        setIsSubmitting(false)
      })
      .catch(() => {
        setIsError(true)
        setIsSubmitting(false)
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      <SectionFormTitle>Project Details Form</SectionFormTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Has project end date radio group */}
        <FormQuestionDiv>
          <FormLabel id='has-project-end-date-label'>
            {questions.hasProjectEndDate.question}
          </FormLabel>
          <Controller
            name='hasProjectEndDate'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby='has-project-end-date-label'
                name='radio-buttons-group'>
                <FormControlLabel value={true} control={<Radio />} label='Yes' />
                <FormControlLabel value={false} control={<Radio />} label='No' />
              </RadioGroup>
            )}
          />
        </FormQuestionDiv>
        {/* Start Date */}
        <FormQuestionDiv>
          <FormLabel>Project Duration</FormLabel>
          <FormLabel htmlFor='start-date'>{questions.projectStartDate.question}</FormLabel>
          <Controller
            name='projectStartDate'
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='start-date'
                    label='Project start date'
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
          <ErrorText>{errors.projectStartDate?.message}</ErrorText>
        </FormQuestionDiv>
        {/* End Date */}
        {showEndDateInput && (
          <FormQuestionDiv>
            <FormLabel htmlFor='end-date'>{questions.projectEndDate.question}</FormLabel>
            <Controller
              name='projectEndDate'
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                  <Stack spacing={3}>
                    <MobileDatePicker
                      id='end-date'
                      label='Project end date'
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
            <ErrorText>{errors.projectEndDate?.message}</ErrorText>
          </FormQuestionDiv>
        )}
        {/* Countries selector */}
        <FormQuestionDiv>
          <FormLabel htmlFor='countries'>{questions.countries.question}</FormLabel>
          <Controller
            name='countries'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                disablePortal
                multiple
                options={countriesGeojson}
                getOptionLabel={(feature) => (feature ? feature.properties.country : '')}
                renderInput={(params) => <TextField {...params} label='Country' id='countries' />}
                onChange={(e, values) => {
                  onCountriesChange(field, values)
                }}
                isOptionEqualToValue={(option, value) =>
                  option.properties.country === value.properties.country
                }
              />
            )}
          />
          <ErrorText>{errors.countries?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Draw or upload site area */}
        <FormQuestionDiv>
          <FormLabel>{questions.siteArea.question}</FormLabel>
          <Controller
            name='siteArea'
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <ProjectAreaMap
                extent={mapExtent}
                setExtent={setMapExtent}
                height='400px'
                siteAreaFeatureCollection={field.value}
                setSiteAreaFeatureCollection={(value) => {
                  onSiteAreaFeatureCollectionChange(field, value)
                }}></ProjectAreaMap>
            )}
          />
          <ErrorText>{errors.siteArea?.features?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && <ErrorText>{language.error.submit}</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting} />
        </FormQuestionDiv>
      </Form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm
