import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ButtonSubmit } from '../styles/buttons'
import { ErrorText, Link } from '../styles/typography'
import {
  StickyFormLabel,
  Form,
  FormQuestionDiv,
  MainFormDiv,
  SectionFormTitle,
  FormPageHeader
} from '../styles/forms'
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
  const [stakeholderTypes, setStakeholderTypes] = useState([])

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
    governmentArrangement: multiselectWithOtherValidation,
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

  const setInitialStakeholderTypesFromServerData = useCallback((serverResponse) => {
    const initialStakeholders =
      serverResponse?.data.find((dataItem) => dataItem.question_id === '2.1')?.answer_value ?? []

    const initialStakeholderTypes = initialStakeholders?.map(
      (stakeholder) => stakeholder.stakeholderType
    )
    setStakeholderTypes(initialStakeholderTypes)
  }, [])

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.siteBackground,
    resetForm,
    setIsLoading,
    successCallback: setInitialStakeholderTypesFromServerData
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
    const stakeholderTypesCopy = stakeholderTypes
    if (event.target.checked) {
      stakeholdersAppend({ stakeholderType: stakeholder })
      stakeholderTypes.push(stakeholder)
    } else {
      const fieldIndex = stakeholdersFields.findIndex(
        (field) => field.stakeholderType === stakeholder
      )
      const typeIndex = stakeholderTypesCopy.findIndex((type) => type === stakeholder)
      stakeholderTypesCopy.splice(typeIndex, 1)
      setStakeholderTypes(stakeholderTypesCopy)
      stakeholdersRemove(fieldIndex)
    }
  }

  const getStakeholder = (stakeholder) =>
    stakeholdersFields.find((field) => field.stakeholderType === stakeholder)

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      {/* Select Stakeholders */}
      <FormPageHeader>
        <SectionFormTitle>Site Background Form</SectionFormTitle>
        <Link to={-1}>&larr; {language.form.navigateBackToSiteOverview}</Link>
      </FormPageHeader>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormQuestionDiv>
          <StickyFormLabel>{siteBackground.stakeholders.question}</StickyFormLabel>
          <List>
            {siteBackground.stakeholders.options.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      checked={stakeholderTypes.includes(stakeholder)}
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
          <StickyFormLabel>{siteBackground.managementStatus.question}</StickyFormLabel>
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
          <StickyFormLabel>{siteBackground.lawStatus.question}</StickyFormLabel>
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
          <StickyFormLabel>{siteBackground.managementArea.question}</StickyFormLabel>
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
          <StickyFormLabel>{siteBackground.areStakeholdersInvolved.question}</StickyFormLabel>
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
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.governmentArrangement?.selectedValues?.message}</ErrorText>
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
          <StickyFormLabel>{siteBackground.customaryRights.question}</StickyFormLabel>
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
      </Form>
    </MainFormDiv>
  )
}

export default ProjectDetailsForm
