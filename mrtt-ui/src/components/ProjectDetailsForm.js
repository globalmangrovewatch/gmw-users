import { useState } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Autocomplete from '@mui/material/Autocomplete'

import { MainFormDiv, FormQuestionDiv, SectionFormTitle } from '../styles/forms'
import countries from '../data/countries.json'
import { mapDataForApi } from '../library/mapDataForApi'
import ButtonSubmit from './ButtonSubmit'

const ProjectDetailsForm = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    hasProjectEndDate: Yup.boolean(),
    projectStartDate: Yup.string().required('Select a start date'),
    projectEndDate: Yup.string().when('hasProjectEndDate', {
      is: true,
      then: Yup.string().required('Please select an end date')
    }),
    countries: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          code: Yup.string()
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

    const preppedData = mapDataForApi('projectDetails', data)

    // make axios PUT request
    axios
      .put(url, preppedData)
      .then((res) => {
        setIsSubmitting(false)
        console.log(res)
      })
      .catch((error) => {
        setIsError(true)
        console.log(error)
      })
  }

  return (
    <MainFormDiv>
      <SectionFormTitle>Project Details Form</SectionFormTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Has project end date radio group */}
        <FormQuestionDiv>
          <FormLabel>1.1a Does the project have an end date?</FormLabel>
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
          <FormLabel>1.1b</FormLabel>
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
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.projectStartDate?.message}
          </Typography>
        </FormQuestionDiv>
        {/* End Date */}
        {watchHasProjectEndDate === 'true' && (
          <FormQuestionDiv>
            <FormLabel>1.1c</FormLabel>
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
            <Typography variant='subtitle' sx={{ color: 'red' }}>
              {errors.projectEndDate?.message}
            </Typography>
          </FormQuestionDiv>
        )}
        {/* Countries selector */}
        <FormQuestionDiv>
          <FormLabel>1.2 What country/countries is the site located in?</FormLabel>
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
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.countries?.message}
          </Typography>
        </FormQuestionDiv>
        {/* Draw Pologon - TO BE INSERTED */}
        <FormQuestionDiv>
          <FormLabel>1.3 What is the overall site area?</FormLabel>
        </FormQuestionDiv>
        {isError && (
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            Submit failed, please try again
          </Typography>
        )}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm
