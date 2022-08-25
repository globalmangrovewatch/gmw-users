import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { FormControlLabel, Radio, RadioGroup, Stack, TextField } from '@mui/material'
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

import { ErrorText, PageSubtitle, PageTitle } from '../styles/typography'
import { StickyFormLabel, FormPageHeader, FormQuestionDiv, Form } from '../styles/forms'
import { mapDataForApi } from '../library/mapDataForApi'
import { projectDetails as questions } from '../data/questions'
import { questionMapping } from '../data/questionMapping'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import emptyFeatureCollection from '../data/emptyFeatureCollection'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import mangroveCountries from '../data/mangrove_countries.json'
import ProjectAreaMap from './ProjectAreaMap'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import { ContentWrapper } from '../styles/containers'
import QuestionNav from './QuestionNav'
import useSiteInfo from '../library/useSiteInfo'

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
  const { site_name } = useSiteInfo()
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

  const {
    control,
    handleSubmit: validateInputs,
    formState,
    watch,
    reset: resetForm
  } = useForm(formOptions)
  const { errors } = formState
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  let watchHasProjectEndDate = watch('hasProjectEndDate', false)
  /* showEndDateInput is a hack because MUI follows native html and casts values to strings.
   The api casts them to boolean so we support both */
  const showEndDateInput = watchHasProjectEndDate === 'true' || watchHasProjectEndDate === true

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
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

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setIsError(false)

    if (!formData) return

    axios
      .patch(apiAnswersUrl, mapDataForApi('projectDetails', formData))
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsError(true)
        setIsSubmitting(false)
        toast.error(language.error.submit)
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteDetails}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='project-details'
      />
      <Form>
        {/* Start Date */}
        <FormQuestionDiv>
          <StickyFormLabel id='project-start-date-label'>
            {questions.projectStartDate.question}*
          </StickyFormLabel>
          <Controller
            name='projectStartDate'
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='start-date'
                    label='date'
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
          <ErrorText>{errors.projectStartDate?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Has project end date radio group */}
        <FormQuestionDiv>
          <StickyFormLabel id='has-project-end-date-label'>
            {questions.hasProjectEndDate.question}*
          </StickyFormLabel>
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
        {/* End Date */}
        {showEndDateInput && (
          <FormQuestionDiv>
            <StickyFormLabel id='project-end-date-label'>
              {questions.projectEndDate.question}*
            </StickyFormLabel>
            <Controller
              name='projectEndDate'
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                  <Stack spacing={3}>
                    <MobileDatePicker
                      id='end-date'
                      label='date'
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
            <ErrorText>{errors.projectEndDate?.message}</ErrorText>
          </FormQuestionDiv>
        )}
        {/* Countries selector */}
        <FormQuestionDiv>
          <StickyFormLabel htmlFor='countries'>{questions.countries.question}*</StickyFormLabel>
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
          <StickyFormLabel>{questions.siteArea.question}*</StickyFormLabel>
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
      </Form>
    </ContentWrapper>
  )
}

export default ProjectDetailsForm
