import { useState } from 'react'
import axios from 'axios'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@mui/material'

import { MainFormDiv, FormQuestionDiv } from '../styles/forms'
import {
  areStakeholdersInvolvedOptions,
  governmentArrangementOptions,
  lawOptions,
  managementStatusOptions,
  protectionStatusOptions,
  stakeholderOptions
} from '../data/projectDetailsOptions'
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
    managementStatus: Yup.string(),
    lawStatus: Yup.string(),
    managementArea: Yup.string(),
    protectionStatus: Yup.array().of(Yup.string()),
    areStakeholdersInvolved: Yup.string(),
    govermentArrangement: Yup.array().of(Yup.string())
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() and useFieldArray() hooks
  const { handleSubmit, formState, control } = useForm(formOptions)
  const { errors } = formState
  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control })

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
      stakeholdersAppend({ stakeholderType: stakeholder })
    } else {
      const index = stakeholdersFields.findIndex((field) => field.stakeholderType === stakeholder)
      stakeholdersRemove(index)
    }
  }

  // TODO: handle '2.5 other protection status textfield add in'

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
                    {stakeholdersFields.find((field) => field.stakeholderType === stakeholder) && (
                      <Controller
                        name={`stakeholders.${stakeholdersFields.findIndex(
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
        {/* Select Management Status*/}
        <FormQuestionDiv>
          <FormLabel>
            2.2 What was the management status of the site immediately before the project started?
          </FormLabel>
          <Controller
            name='managementStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {managementStatusOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.managementStatus?.message}
          </Typography>
        </FormQuestionDiv>
        {/* Law recognition */}
        <FormQuestionDiv>
          <FormLabel>
            2.3 Are management activities at the site recognized in statutory or customary laws?
          </FormLabel>
          <Controller
            name='lawStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {lawOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.lawStatus?.message}
          </Typography>
        </FormQuestionDiv>
        {/* Management Area*/}
        <FormQuestionDiv>
          <FormLabel>
            2.4 Name of the formal management area the site is contained within (if relevant)?
          </FormLabel>
          <Controller
            name='managementArea'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} value={field.value}></TextField>}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.managementArea?.message}
          </Typography>
        </FormQuestionDiv>
        {/* Protection Status*/}
        <FormQuestionDiv>
          <FormLabel>
            2.5 How would you describe the protection status of the site immediately before the
            project started?
          </FormLabel>
          <Controller
            name='protectionStatus'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                value={field.value}
                label='select'
                input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}>
                {protectionStatusOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.protectionStatus?.message}
          </Typography>
        </FormQuestionDiv>
        {/* areStakeholdersInvolved */}
        <FormQuestionDiv>
          <FormLabel>
            2.6 Are the stakeholders involved in project activities able to influence site
            management rules?
          </FormLabel>
          <Controller
            name='areStakeholdersInvolved '
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {areStakeholdersInvolvedOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.areStakeholdersInvolved?.message}
          </Typography>
        </FormQuestionDiv>
        {/* Government Arrangement */}
        <FormQuestionDiv>
          <FormLabel>
            2.7 What best describes the governance arrangement of the site immediately before the
            project started?
          </FormLabel>
          <Controller
            name='governmentArrangement'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                value={field.value}
                label='select'
                input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}>
                {governmentArrangementOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.govermentArrangement?.message}
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
