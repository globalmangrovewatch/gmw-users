import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Button, Checkbox, FormLabel, List, ListItem, Typography } from '@mui/material'

import { MainFormDiv, FormQuestionDiv } from '../styles/forms'
import { stakeholderOptions } from '../data/stakeholders'
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
    )
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() and useFieldArray() hooks
  const { control, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState
  const { fields, append } = useFieldArray({ name: 'stakeholders', control })

  // state variables
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  // add stakeholder list to fields array on mount
  useEffect(() => {
    fields.length = stakeholderOptions.length
    stakeholderOptions.forEach((stakeholder) =>
      append({ stakeholderType: stakeholder, stakeholderName: '' })
    )
    // these console logs appear twice on initial load
    // keys are duplicated (38 items appear instead of 19)
    // every time I save a new change, another set of duplicates gets added
    // it looks like useEffect is called twice for some reason on initial load
    // intentially left empty dependency array so useeffect is only called once on mount
    console.log('fields length: ', fields.length)
    console.log('fields', fields)
  }, [])

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
        console.log(error)
      })
  }
  return (
    <MainFormDiv>
      {/* Select Stakeholders */}
      <Typography variant='h4' sx={{ marginBottom: '0.5em' }}>
        Site Background Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormQuestionDiv>
          <FormLabel>2.1 What stakeholders are involved in the project activities?</FormLabel>
          <List>
            {fields.map((item, index) => (
              <ListItem key={item.id}>
                <div>{item.stakeholderType}</div>
                <Controller
                  name={`stakeholders[${index}]stakeholderType`}
                  control={control}
                  mode='onBlur'
                  // defaultValue={item.stakeholderType}
                  render={({ field }) => <Checkbox {...field}>{item.stakeholderType}</Checkbox>}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.stakeholders?.message}
          </Typography>
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
