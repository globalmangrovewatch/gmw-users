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

import countries from '../data/countries.json'
import { projectDetails } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ErrorText } from '../styles/typography'
import { MainFormDiv, FormQuestionDiv, SectionFormTitle, Form } from '../styles/forms'
import ButtonSubmit from './ButtonSubmit'
import language from '../language'

const ProjectDetailsForm = () => {
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
      .min(1)
      .typeError('Select at least one country')
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { control, handleSubmit, formState, watch } = useForm(formOptions)
  const { errors } = formState
  const watchHasProjectEndDate = watch('hasProjectEndDate', 'false')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

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

  return (
    <MainFormDiv>
      <SectionFormTitle>Project Details Form</SectionFormTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Has project end date radio group */}
        <FormQuestionDiv>
          <FormLabel>{projectDetails.hasProjectEndDate.question}</FormLabel>
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
          <FormLabel>{projectDetails.projectStartDate.question}</FormLabel>
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
            <FormLabel>{projectDetails.projectEndDate.question}</FormLabel>
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
          <FormLabel>{projectDetails.countries.question}</FormLabel>
          <Controller
            name='countries'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                disablePortal
                multiple
                options={countries}
                getOptionLabel={(option) => (option ? option.name : '')}
                renderInput={(params) => <TextField {...params} label='Country' />}
                onChange={(e, values) => {
                  field.onChange(values)
                }}
              />
            )}
          />
          <ErrorText>{errors.countries?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Draw Pologon - TO BE INSERTED */}
        <FormQuestionDiv>
          <FormLabel>{projectDetails.siteArea.question}</FormLabel>
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
