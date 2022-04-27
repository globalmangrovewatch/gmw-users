import React from 'react'
import styles from './style.module.scss'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  TextField,
  Checkbox,
  FormLabel,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

function ProjectDetailsForm() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    projectTitle: Yup.string().required('Project title is required'),
    projectAims: Yup.array().of(Yup.string()).typeError('Select at least one item'),
    projectDuration: Yup.number().required('Number is required').typeError('Must be a number'),
    projectDurationUnit: Yup.string().required('Project period is required')
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { register, control, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState

  const onSubmit = (data) => console.log('data: ', data)

  const options = ['Restoration/Rehabilitation', 'Afforestation', 'Protection', 'Other']

  return (
    <div className="project-details-form">
      <h1>Project Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Project Title */}
        <div className={styles.formGroup}>
          <InputLabel sx={{ color: 'black' }}>Project title</InputLabel>
          <Controller
            name="projectTitle"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                required
                id="outlined-required"
                label="Required"
                variant="outlined"
                {...field}
              />
            )}
          />
          <div className={styles.invalid}>{errors.projectTitle?.message}</div>
        </div>
        {/* Project Aims */}
        <div className={styles.formGroup}>
          <InputLabel sx={{ color: 'black' }}>
            What is the overall aim for the project area?
          </InputLabel>
          {options.map((value) => (
            <FormLabel key={value}>
              <Checkbox
                key={value}
                type="checkbox"
                value={value}
                {...register('projectAims', { required: true })}
              />
              {value}
            </FormLabel>
          ))}
          <div className={styles.invalid}>{errors.projectAims?.message}</div>
        </div>
        {/* Project Duration */}
        <div className={styles.formGroup}>
          <InputLabel sx={{ color: 'black' }}>Project duration (number)</InputLabel>
          <Controller
            name="projectDuration"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                required
                id="outlined-required"
                label="Required"
                variant="outlined"
                {...field}
              />
            )}
          />
          <div className={styles.invalid}>{errors.projectDuration?.message}</div>
          {/* Project Period */}
          <InputLabel sx={{ color: 'black' }}>Period</InputLabel>
          <Controller
            name="projectDurationUnit"
            control={control}
            defaultValue="months"
            render={({ field }) => (
              <Select labelId="demo-simple-select-label" label="Period" {...field}>
                <MenuItem value="months">Month(s)</MenuItem>
                <MenuItem value="years">Year(s)</MenuItem>
              </Select>
            )}
          />
        </div>
        <div className={styles.formGroup}>
          <Controller
            name="projectStartDate"
            control={control}
            defaultValue="months"
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    label="Project start date"
                    onChange={(newValue) => {
                      field.onChange(newValue)
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            )}
          />
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <MobileDatePicker
                label="Project start date"
                // value={value}
                // onChange={(newValue) => {
                //   setValue(newValue)
                // }}
                renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </LocalizationProvider> */}
        </div>
        <Button sx={{ marginTop: '1em' }} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}

export default ProjectDetailsForm
