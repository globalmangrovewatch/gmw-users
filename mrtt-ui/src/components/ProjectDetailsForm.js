import { useState } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import Autocomplete from '@mui/material/Autocomplete'

import ProjectAreaMap from './ProjectAreaMap'
import MangroveCountries from '../data/mangrove_countries.json'
import { questionMapping } from '../data/questionMapping'

const DownloadButtonGroup = styled(ButtonGroup)`
  justify-content: center;
  margin-bottom: 1.5em;
`
const sortCountries = (a, b) => {
  const textA = a.properties.country.toUpperCase()
  const textB = b.properties.country.toUpperCase()

  return textA < textB ? -1 : textA > textB ? 1 : 0
}
const countriesGeojson = MangroveCountries.features
  .filter((feature) => feature.properties.mangroves > 0)
  .sort(sortCountries)

function ProjectDetailsForm() {
  const [mapExtent, setMapExtent] = useState(undefined)

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

  const onCountriesChange = (field, values) => {
    field.onChange(values)
    if (values.length > 0) {
      setMapExtent(values[0].bbox)
    } else {
      setMapExtent(undefined)
    }
  }

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)
    const preppedData = []
    const url = `${process.env.REACT_APP_API_URL}sites/1/registration_answers`

    if (!data) return

    // set up data structure for api
    for (const [key, value] of Object.entries(data)) {
      // map question ids with keys
      if (Object.prototype.hasOwnProperty.call(questionMapping.projectDetails, key)) {
        preppedData.push({ question_id: questionMapping.projectDetails[key], answer_value: value })
      }
    }
    // make axios PUT request
    axios
      .put(url, preppedData)
      .then((res) => {
        setisSubmitting(false)
        console.log(res)
      })
      .catch((error) => {
        setIsError(true)
        console.log(error)
      })
  }

  return (
    <ProjectDetailsFormDiv>
      <Typography variant='h4' sx={{ marginBottom: '0.5em' }}>
        Project Details Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Has project end date radio group */}
        <FormGroupDiv>
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
        </FormGroupDiv>
        {/* Start Date */}
        <FormGroupDiv>
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
        </FormGroupDiv>
        {/* End Date */}
        {watchHasProjectEndDate === 'true' && (
          <FormGroupDiv>
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
          </FormGroupDiv>
        )}
        {/* Countries selector */}
        <FormGroupDiv>
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
                options={countriesGeojson}
                getOptionLabel={(feature) => (feature ? feature.properties.country : '')}
                renderInput={(params) => <TextField {...params} label='Country' />}
                onChange={(e, values) => {
                  onCountriesChange(field, values)
                }}
              />
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.countries?.message}
          </Typography>
        </FormGroupDiv>
        {/* Draw Pologon - TO BE INSERTED */}
        <FormGroupDiv>
          <FormLabel>1.3 What is the overall site area?</FormLabel>
          <DownloadButtonGroup variant='outlined' aria-label='outlined primary button group'>
            <Button>Draw Polygon</Button>
            <Button>Upload Polygon</Button>
          </DownloadButtonGroup>
          <ProjectAreaMap extent={mapExtent}></ProjectAreaMap>
        </FormGroupDiv>
        {isError && (
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            Submit failed, please try again
          </Typography>
        )}
        <Button sx={{ marginTop: '1em' }} variant='contained' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </ProjectDetailsFormDiv>
  )
}

// Styles

const ProjectDetailsFormDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '1.5em'
}))

const FormGroupDiv = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '1em',
  marginTop: '2em'
}))

export default ProjectDetailsForm
