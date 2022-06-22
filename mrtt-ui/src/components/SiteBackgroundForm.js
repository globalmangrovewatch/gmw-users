import {
  Box,
  Checkbox,
  // Chip,
  FormLabel,
  List,
  ListItem,
  MenuItem,
  // OutlinedInput,
  // Select,
  TextField,
  Typography
} from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonSubmit } from '../styles/buttons'
import { ErrorText, Link } from '../styles/typography'
import { FormQuestionDiv, MainFormDiv, SectionFormTitle } from '../styles/forms'
import { mapDataForApi } from '../library/mapDataForApi'
import { multiselectWithOtherValidation } from '../validation/multiSelectWithOther'
import { siteBackground } from '../data/questions'
import { toast } from 'react-toastify'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import { questionMapping } from '../data/questionMapping'

const ProjectDetailsForm = () => {
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = yup.object().shape({
    stakeholders: yup
      .array()
      .of(
        yup.object().shape({
          stakeholderType: yup.string(),
          stackholderName: yup.string()
        })
      )
      .min(1)
      .required('Select at least one stakeholder'),
    managementStatus: yup.string(),
    lawStatus: yup.string(),
    managementArea: yup.string(),
    protectionStatus: multiselectWithOtherValidation,
    areStakeholdersInvolved: yup.string().nullable(),
    governmentArrangement: yup.array().of(yup.string()),
    landTenure: multiselectWithOtherValidation,
    customaryRights: yup.string()
  })

  const reactHookFormInstance = useForm({
    defaultValues: {
      protectionStatus: { selectedValues: [], otherValue: undefined },
      landTenure: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    control,
    reset: resetForm
  } = reactHookFormInstance

  const {
    fields: stakeholdersFields,
    append: stakeholdersAppend,
    remove: stakeholdersRemove
  } = useFieldArray({ name: 'stakeholders', control })

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.siteBackground,
    resetForm,
    setIsLoading
  })

  const handleSubmit = async (formData) => {
    setisSubmitting(true)
    setIsError(false)

    if (!formData) return

    axios
      .patch(apiAnswersUrl, mapDataForApi('siteBackground', formData))
      .then(() => {
        setisSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
        toast.error(language.error.submit)
      })
  }

  const handleStakeholdersOnChange = (event, stakeholder) => {
    if (event.target.checked) {
      stakeholdersAppend({ stakeholderType: stakeholder })
    } else {
      const index = stakeholdersFields.findIndex((field) => field.stakeholderType === stakeholder)
      stakeholdersRemove(index)
    }
  }

  const getStakeholder = (stakeholder) =>
    stakeholdersFields.find((field) => field.stakeholderType === stakeholder)

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      {/* Select Stakeholders */}
      <SectionFormTitle>Site Background Form</SectionFormTitle>
      <Link to={-1}>&lt; {language.form.navigateBackToSiteOverview}</Link>
      <form onSubmit={validateInputs(handleSubmit)}>
        <FormQuestionDiv>
          <FormLabel>{siteBackground.stakeholders.question}</FormLabel>
          <List>
            {siteBackground.stakeholders.options.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      onChange={(event) =>
                        handleStakeholdersOnChange(event, stakeholder)
                      }></Checkbox>
                    <Typography variant='subtitle'>{stakeholder}</Typography>
                  </Box>
                  <Box>
                    {getStakeholder(stakeholder) && (
                      <Controller
                        name={`stakeholders.${stakeholdersFields.findIndex(
                          (field) => field.stakeholderType === stakeholder
                        )}.stakeholderName`}
                        control={control}
                        defaultValue=''
                        render={({ field }) => (
                          <TextField
                            sx={{ marginTop: '1em' }}
                            label='Name'
                            variant='outlined'
                            {...field}
                          />
                        )}
                      />
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
          <ErrorText>{errors.stakeholders?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Select Management Status*/}
        <FormQuestionDiv>
          <FormLabel>{siteBackground.managementStatus.question}</FormLabel>
          <Controller
            name='managementStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.managementStatus.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.managementStatus?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Law recognition */}
        <FormQuestionDiv>
          <FormLabel>{siteBackground.lawStatus.question}</FormLabel>
          <Controller
            name='lawStatus'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.lawStatus.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.lawStatus?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Management Area*/}
        <FormQuestionDiv>
          <FormLabel>{siteBackground.managementArea.question}</FormLabel>
          <Controller
            name='managementArea'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} value={field.value}></TextField>}
          />
          <ErrorText>{errors.managementArea?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Protection Status*/}
        <CheckboxGroupWithLabelAndController
          fieldName='protectionStatus'
          reactHookFormInstance={reactHookFormInstance}
          options={siteBackground.protectionStatus.options}
          question={siteBackground.protectionStatus.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.protectionStatus?.selectedValues?.message}</ErrorText>
        {/* areStakeholdersInvolved */}
        <FormQuestionDiv>
          <FormLabel>{siteBackground.areStakeholdersInvolved.question}</FormLabel>
          <Controller
            name='areStakeholdersInvolved'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.areStakeholdersInvolved.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText variant='subtitle' sx={{ color: 'red' }}>
            {errors.areStakeholdersInvolved?.message}
          </ErrorText>
        </FormQuestionDiv>
        {/* Government Arrangement */}
        <CheckboxGroupWithLabelAndController
          fieldName='governmentArrangement'
          reactHookFormInstance={reactHookFormInstance}
          options={siteBackground.governmentArrangement.options}
          question={siteBackground.governmentArrangement.question}
          // shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.govermentArrangement?.message}</ErrorText>
        {/* <FormQuestionDiv>
          <FormLabel>{siteBackground.govermentArrangement.question}</FormLabel>
          <Controller
            name='governmentArrangement'
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                multiple
                value={field.value}
                label={language.form.selectLabel}
                input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}>
                {siteBackground.govermentArrangement.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <ErrorText>{errors.govermentArrangement?.message}</ErrorText>
        </FormQuestionDiv> */}
        {/* Land Tenure */}
        <CheckboxGroupWithLabelAndController
          fieldName='landTenure'
          reactHookFormInstance={reactHookFormInstance}
          options={siteBackground.landTenure.options}
          question={siteBackground.landTenure.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.landTenure?.selectedValues?.message}</ErrorText>
        {/* customaryRights */}
        <FormQuestionDiv>
          <FormLabel>{siteBackground.customaryRights.question}</FormLabel>
          <Controller
            name='customaryRights'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label={language.form.selectLabel}>
                {siteBackground.customaryRights.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.customaryRights?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm
