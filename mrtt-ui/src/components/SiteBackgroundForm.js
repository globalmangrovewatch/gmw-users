import { useState } from 'react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, FormLabel, TextField, Typography } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'

import { MainFormDiv, FormQuestionDiv } from '../styles/forms'
// TODO: update question mapping to include 2.0 questions
import { questionMapping } from '../data/questionMapping'

const ProjectDetailsForm = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    stakeholders: Yup.array().of(Yup.string())
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { control, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const stakeholderOptions = [
    'Local community representatives',
    'Local leaders',
    'Indigenous peoples',
    'Traditionally marginalised or underrepresented groups',
    'Landowners/customary area owners',
    'National, central or federal government',
    'Sub-national, regional or state government',
    'Local or municipal government',
    'Overseas government agencies ',
    'Intergovernmental agencies',
    'Managed area manager/personnel',
    'International or national NGO',
    'Small-scale local NGO',
    'Community based organisations, associations or cooperatives',
    'Industry/Private sector',
    'Academic institute or research facility',
    'Ecotourists',
    'Unknown',
    'Other'
  ]

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)
    const preppedData = []
    // TODO: update url to match form section
    const url = `${process.env.REACT_APP_API_URL}sites/1/registration_answers`

    if (!data) return

    // TODO: make more general & reusable function
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
    <MainFormDiv>
      <Typography variant='h4' sx={{ marginBottom: '0.5em' }}>
        Site Background Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormQuestionDiv>
          <FormLabel>2.1 What stakeholders are involved in the project activities?</FormLabel>
          <Controller
            name='stakeholders'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Autocomplete
                {...field}
                disablePortal
                multiple
                options={stakeholderOptions}
                // getOptionLabel={(option) => (option ? option.name : '')}
                renderInput={(params) => <TextField {...params} label='Stakeholder' />}
                onChange={(e, values) => {
                  field.onChange(values)
                }}
              />
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.stakeholders?.message}
          </Typography>
        </FormQuestionDiv>
        {isError && (
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            Submit failed, please try again
          </Typography>
        )}
        <Button sx={{ marginTop: '1em' }} variant='contained' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm
