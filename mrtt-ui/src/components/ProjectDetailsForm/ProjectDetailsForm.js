import { useState } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Autocomplete from '@mui/material/Autocomplete'

import styles from './style.module.scss'
import countries from '../../data/countries.json'
import { projectDetailsMapping } from '../../data/questionMappingProjectDetails'

function ProjectDetailsForm() {
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
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)
    let preppedData = []
    const url = 'https://mrtt-api-test.herokuapp.com/api/v2/sites/1/registration_answers'

    if (!data) return

    // set up data structure for api
    for (const [key, value] of Object.entries(data)) {
      // map question ids with keys
      // eslint-disable-next-line no-prototype-builtins
      if (projectDetailsMapping.hasOwnProperty(key)) {
        preppedData.push({ question_id: projectDetailsMapping[key], answer_value: value })
      }
    }

    // make axios PUT request
    axios
      .put(url, preppedData)
      .then((res) => {
        console.log(res)
        setisSubmitting(false)
      })
      .catch((error) => {
        setIsError(true)
        console.log(error)
      })
  }

  return (
    <div className={styles.projectDetailsForm}>
      <h1>Project Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Has project end date radio group */}
        <div className={styles.formGroup}>
          <FormLabel sx={{ color: 'black' }}>1.1a Does the project have an end date?</FormLabel>
          <Controller
            name="hasProjectEndDate"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group">
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            )}
          />
        </div>
        {/* Start Date */}
        <div className={styles.formGroup}>
          <FormLabel sx={{ color: 'black', marginBottom: '0.5em' }}>Project Duration</FormLabel>
          <FormLabel sx={{ color: 'black' }}>1.1b</FormLabel>
          <Controller
            name="projectStartDate"
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    label="Project start date"
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
          <div className={styles.invalid}>{errors.projectStartDate?.message}</div>
        </div>
        {/* End Date */}
        {watchHasProjectEndDate === 'true' && (
          <div className={styles.formGroup}>
            <FormLabel sx={{ color: 'black' }}>1.1c</FormLabel>
            <Controller
              name="projectEndDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                  <Stack spacing={3}>
                    <MobileDatePicker
                      label="Project end date"
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
            <div className={styles.invalid}>{errors.projectEndDate?.message}</div>
          </div>
        )}
        {/* Countries selector */}
        <div className={styles.formGroup}>
          <FormLabel sx={{ color: 'black', marginBottom: '1.5em' }}>
            1.2 What country/countries is the site located in?
          </FormLabel>
          <Controller
            name="countries"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                disablePortal
                multiple
                options={countries}
                getOptionLabel={(option) => (option ? option.name : '')}
                renderInput={(params) => <TextField {...params} label="Country" />}
                onChange={(e, values) => {
                  field.onChange(values)
                }}
              />
            )}
          />
          <div className={styles.invalid}>{errors.countries?.message}</div>
        </div>
        {/* Draw Pologon - TO BE INSERTED */}
        <div className={styles.formGroup}>
          <FormLabel sx={{ color: 'black', marginBottom: '1.5em' }}>
            1.3 What is the overall site area?
          </FormLabel>
        </div>
        {isError && <div className={styles.invalid}>{'Submit failed, please try again'}</div>}
        <Button sx={{ marginTop: '1em' }} variant="contained" type="submit" disabled={isSubmitting}>
          {isSubmitting ? `Submitting...` : `Submit`}
        </Button>
      </form>
    </div>
  )
}

export default ProjectDetailsForm
