import styles from './style.module.scss'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import countries from '../../data/countries.json'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Autocomplete from '@mui/material/Autocomplete'

function ProjectDetailsForm() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    projectTitle: Yup.string().required('Project title is required'),
    projectAims: Yup.array().of(Yup.string()).typeError('Select at least one project aim'),
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
  const { register, control, handleSubmit, formState, watch } = useForm(formOptions)
  const { errors } = formState
  const watchHasProjectEndDate = watch('hasProjectEndDate', 'false')

  const onSubmit = async (data) => {
    let preppedData = []
    const url = 'https://mrtt-api-test.herokuapp.com/api/v2/sites/1/registration_answers'

    if (!data) return

    // set up data structure for api
    for (const [key, value] of Object.entries(data)) {
      preppedData.push({ question_id: key, answer_value: value })
    }

    // make axios patch request
    // TODO: decide on how to handle error and response
    axios
      .put(url, preppedData)
      .then((res) => {
        console.log(res)
      })
      .catch((error) => console.log(error))
  }

  const options = ['Restoration/Rehabilitation', 'Afforestation', 'Protection', 'Other']

  return (
    <div className={styles.projectDetailsForm}>
      <h1>Project Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Project Title */}
        <div className={styles.formGroup}>
          <InputLabel sx={{ color: 'black' }}>1.1 Project title</InputLabel>
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
          <FormLabel sx={{ color: 'black' }}>
            1.2 What is the overall aim for the project area?
          </FormLabel>
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
        {/* Has project end date radio group */}
        <div className={styles.formGroup}>
          <FormLabel sx={{ color: 'black' }}>1.2a Does the project have an end date?</FormLabel>
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
          <FormLabel sx={{ color: 'black', marginBottom: '1.5em' }}>Project Duration</FormLabel>
          <FormLabel sx={{ color: 'black' }}>1.2b</FormLabel>
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
            <FormLabel sx={{ color: 'black' }}>1.2c</FormLabel>
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
            1.3 What country/countries is the site located in?
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
        <Button sx={{ marginTop: '1em' }} variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}

export default ProjectDetailsForm
