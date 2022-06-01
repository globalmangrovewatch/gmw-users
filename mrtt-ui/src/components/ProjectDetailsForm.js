import { FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
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

import { projectDetails as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ErrorText } from '../styles/typography'
import { MainFormDiv, FormQuestionDiv, SectionFormTitle, Form } from '../styles/forms'
import ButtonSubmit from './ButtonSubmit'
import language from '../language'
import MangroveCountries from '../data/mangrove_countries.json'
import ProjectAreaMap from './ProjectAreaMap'

const sortCountries = (a, b) => {
  const textA = a.properties.country.toUpperCase()
  const textB = b.properties.country.toUpperCase()

  return textA < textB ? -1 : textA > textB ? 1 : 0
}
const countriesGeojson = MangroveCountries.features.sort(sortCountries)

function ProjectDetailsForm() {
  const [mapExtent, setMapExtent] = useState()

  const siteAreaError = 'Please provide a site area'
  // form validation rules
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
          name: yup.string(),
          code: yup.string()
        })
      )
      .min(1, 'Select at least ${min} country')
      .typeError('Select at least 1 country'),
    siteArea: yup
      .object()
      .shape({
        features: yup.array().min(1, siteAreaError).required(siteAreaError)
      })
      .required(siteAreaError)
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  // get functions to build form with useForm() hook
  const { control, handleSubmit, formState, watch } = useForm(formOptions)
  const { errors } = formState
  const watchHasProjectEndDate = watch('hasProjectEndDate', 'false')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const onCountriesChange = (field, features) => {
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
  }

  const onSiteAreaFeatureCollectionChange = (field, featureCollection) => {
    field.onChange(featureCollection)

    if (featureCollection.features && featureCollection.features.length) {
      setMapExtent(turfBbox(turfConvex(featureCollection)))
    }
  }

  const onSubmit = async (data) => {
    debugger // eslint-disable-line
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

  return (
    <MainFormDiv>
      <SectionFormTitle>Project Details Form</SectionFormTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Has project end date radio group */}
        <FormQuestionDiv>
          <FormLabel>{questions.hasProjectEndDate.question}</FormLabel>
          <Controller
            name='hasProjectEndDate'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby='demo-radio-buttons-group-label'
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
          <FormLabel>{questions.projectStartDate.question}</FormLabel>
          <Controller
            name='projectStartDate'
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
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
        {watchHasProjectEndDate === 'true' && (
          <FormQuestionDiv>
            <FormLabel>{questions.projectEndDate.question}</FormLabel>
            <Controller
              name='projectEndDate'
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                  <Stack spacing={3}>
                    <MobileDatePicker
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
          <FormLabel>{questions.countries.question}</FormLabel>
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
                renderInput={(params) => <TextField {...params} label='Country' />}
                onChange={(e, values) => {
                  onCountriesChange(field, values)
                }}
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
