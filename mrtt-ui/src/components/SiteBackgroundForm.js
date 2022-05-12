import { useState } from 'react'
import axios from 'axios'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

import { MainFormDiv, FormQuestionDiv } from '../styles/forms'
import { stakeholderOptions, managementStatusOptions } from '../data/projectDetailsOptions'
// TODO: update question mapping to include 2.0 questions
import { questionMapping } from '../data/questionMapping'

const ProjectDetailsForm = () => {
  // form validation rules
  const validationSchema = Yup.object().shape({
    stakeholders: Yup.array().of(
      Yup.object().shape({
        stakeholderType: Yup.string(),
        stackholderName: Yup.string()
      })
    ),
    managementStatus: Yup.string()
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() and useFieldArray() hooks
  const { handleSubmit, formState, control } = useForm(formOptions)
  const { errors } = formState
  const { fields, append, remove } = useFieldArray({ name: 'stakeholders', control })

  // state variables
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)
    const preppedData = []
    // TODO: update url to match form section
    const url = `${process.env.REACT_APP_API_URL}sites/1/registration_answers`

    if (!data) return

    console.log('data:', data)

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
        setisSubmitting(false)
        console.log(error)
      })
  }

  const handleStakeholdersOnChange = (e, stakeholder) => {
    if (e.target.checked) {
      append({ stakeholderType: stakeholder })
    } else {
      const index = fields.findIndex((field) => field.stakeholderType === stakeholder)
      remove(index)
    }
  }

  return (
    <MainFormDiv>
      {/* Select Stakeholders */}
      <Typography variant='h4' sx={{ marginBottom: '0.5em' }}>
        Site Background Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormQuestionDiv>
          <FormLabel>2.1 Which stakeholders are involved in the project activities?</FormLabel>
          <List>
            {stakeholderOptions.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      onChange={(e) => handleStakeholdersOnChange(e, stakeholder)}></Checkbox>
                    <Typography variant='subtitle'>{stakeholder}</Typography>
                  </Box>
                  <Box>
                    {fields.find((field) => field.stakeholderType === stakeholder) && (
                      <Controller
                        name={`stakeholders.${fields.findIndex(
                          (field) => field.stakeholderType === stakeholder
                        )}.stakeholderName`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField label='Name' variant='outlined' {...field} />
                        )}
                      />
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.stakeholders?.message}
          </Typography>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>
            2.2 What was the management status of the site immediately before the project started?
          </FormLabel>
          <Controller
            name='managementStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Select {...field} value={field.value}>
                {managementStatusOptions.map((status, index) => (
                  <MenuItem key={index} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && (
            <Typography variant='subtitle' sx={{ color: 'red' }}>
              Submit failed, please try again
            </Typography>
          )}
          <Button variant='contained' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </FormQuestionDiv>
      </form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm
