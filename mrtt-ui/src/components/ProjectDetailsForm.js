import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useState } from 'react'

import Autocomplete from '@mui/material/Autocomplete'
import axios from 'axios'
import turfBbox from '@turf/bbox'
import turfBboxPolygon from '@turf/bbox-polygon'
import turfConvex from '@turf/convex'

import { ContentWrapper } from '../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../styles/typography'
import { mapDataForApi } from '../library/mapDataForApi'
import { projectDetails as questions } from '../data/questions'
import { questionMapping } from '../data/questionMapping'
import { StickyFormLabel, FormPageHeader, FormQuestionDiv, FormLayout } from '../styles/forms'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import FormValidationMessageIfErrors from './FormValidationMessageIfErrors'
import language from '../language'
// import LoadingIndicator from './LoadingIndicator'
import mangroveCountries from '../data/mangrove_countries.json'
import ProjectAreaMap from './ProjectAreaMap'
import QuestionNav from './QuestionNav'
import RequiredIndicator from './RequiredIndicator'
import { useInitializeQuestionMappedForm } from '../library/question-mapped-form/useInitializeQuestionMappedForm'
import useSiteInfo from '../library/useSiteInfo'
import DatePickerUtcMui from './DatePickerUtcMui'

export const siteAreaError = 'Please provide a site area'

const sortCountries = (a, b) => {
  const textA = a.properties.country.toUpperCase()
  const textB = b.properties.country.toUpperCase()

  return textA < textB ? -1 : textA > textB ? 1 : 0
}
const countriesGeojson = mangroveCountries.features.sort(sortCountries)

function ProjectDetailsForm() {
  const form = useFormContext()
  const errors = form.errors

  const [mapExtent, setMapExtent] = useState()
  const [isError, setIsError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { site_name } = useSiteInfo()

  // const { errors } = form.formState
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`
  let watchHasProjectEndDate = form.watch('hasProjectEndDate', false)
  /* showEndDateInput is a hack because MUI follows native html and casts values to strings.
   The api casts them to boolean so we support both */
  const showEndDateInput = watchHasProjectEndDate === 'true' || watchHasProjectEndDate === true

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    resetForm: form.reset,
    questionMapping: questionMapping.projectDetails
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

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteDetails}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isError}
        onFormSave={form.handleSubmit(handleSubmit)}
        currentSection='project-details'
      />
      <FormValidationMessageIfErrors formErrors={errors} />
      {/* <FormWrapperProvider> */}
      {/* <FormProvider {...form}> */}
      <FormLayout>
        {/* Start Date */}
        <FormQuestionDiv>
          <StickyFormLabel id='project-start-date-label'>
            {questions?.projectStartDate.question}
            <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='projectStartDate'
            control={form.control}
            render={({ field }) => {
              return <DatePickerUtcMui id='start-date' label='date' field={field} />
            }}
          />
          <ErrorText>{errors?.projectStartDate?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Has project end date radio group */}
        <FormQuestionDiv>
          <StickyFormLabel id='has-project-end-date-label'>
            {questions.hasProjectEndDate.question}
            <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='hasProjectEndDate'
            control={form.control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby='has-project-end-date-label'
                name='radio-buttons-group'
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value === 'true')
                }}>
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
              {questions.projectEndDate.question}
              <RequiredIndicator />
            </StickyFormLabel>
            <Controller
              name='projectEndDate'
              control={form.control}
              render={({ field }) => (
                <DatePickerUtcMui
                  id='end-date'
                  label='date'
                  field={field}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                />
              )}
            />
            <ErrorText>{errors?.projectEndDate?.message}</ErrorText>
          </FormQuestionDiv>
        )}
        {/* Countries selector */}
        <FormQuestionDiv>
          <StickyFormLabel htmlFor='countries'>
            {questions?.countries?.question} <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='countries'
            control={form.control}
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
          <ErrorText>{errors?.countries?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Draw or upload site area */}
        <FormQuestionDiv>
          <StickyFormLabel>
            {questions?.siteArea.question} <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='siteArea'
            control={form.control}
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
          <ErrorText>{errors?.siteArea?.features?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
      {/* </FormProvider> */}
      {/* </FormWrapperProvider> */}
    </ContentWrapper>
  )
}

export default ProjectDetailsForm
