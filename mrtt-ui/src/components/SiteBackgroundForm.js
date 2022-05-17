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
  customaryRightsOptions,
  governmentArrangementOptions,
  landTenureOptions,
  lawOptions,
  managementStatusOptions,
  protectionStatusOptions,
  stakeholderOptions
} from '../data/projectDetailsOptions'
import { mapDataForApi } from '../library/mapDataForApi'

const ProjectDetailsForm = () => {
  let watchProtectionStatus
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
    protectionStatus: Yup.object().shape({
      protectionTypes: Yup.array().of(Yup.string()),
      other: Yup.string().when('protectionStatus.protectionTypes', {
        is: watchProtectionStatus?.protectionTypes?.includes('Other'),
        then: Yup.string().required('Add an other type')
      })
    }),
    areStakeholdersInvolved: Yup.string(),
    govermentArrangement: Yup.array().of(Yup.string()),
    landTenure: Yup.array().of(Yup.string()),
    customaryRights: Yup.string()
  })
  const formOptions = { resolver: yupResolver(validationSchema) } // get functions to build form with useForm() and useFieldArray() hooks
  const { handleSubmit, formState, control, watch } = useForm(formOptions)
  const { errors } = formState
  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control })
  watchProtectionStatus = watch('protectionStatus')

  // state variables
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)
    const preppedData = []
    // TODO: update url to match form section
    const url = `${process.env.REACT_APP_API_URL}/sites/1/registration_answers`

    if (!data) return

    console.log('data:', data)

    mapDataForApi('siteBackground', data)

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

  // TODO: handle '2.5 & 2.8 other option textfield add in'

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
            name='protectionStatus.protectionTypes'
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
                    <Checkbox checked={field.value.indexOf(item) > -1} />
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.protectionStatus?.protectionTypes?.message}
          </Typography>
          {/* Protection Status - Other */}
          {watchProtectionStatus && watchProtectionStatus.protectionTypes.includes('Other') && (
            <Controller
              name='protectionStatus.other'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <FormQuestionDiv>
                  <FormLabel>Please state other protection status:</FormLabel>
                  <TextField
                    {...field}
                    value={field.value}
                    required
                    id='outlined-required'
                    label='Required'></TextField>
                  <Typography variant='subtitle' sx={{ color: 'red' }}>
                    {errors.protectionStatus?.other?.message}
                  </Typography>
                </FormQuestionDiv>
              )}
            />
          )}
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
        {/* Land Tenure */}
        <FormQuestionDiv>
          <FormLabel>
            2.8 What was the land tenure of the site immediately before the project started?
          </FormLabel>
          <Controller
            name='landTenure'
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
                {landTenureOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.landTenure?.message}
          </Typography>
        </FormQuestionDiv>
        {/* customaryRights */}
        <FormQuestionDiv>
          <FormLabel>
            2.9 Are customary rights to land within the site recognised in national law?
          </FormLabel>
          <Controller
            name='customaryRights'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {customaryRightsOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            {errors.customaryRights?.message}
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
