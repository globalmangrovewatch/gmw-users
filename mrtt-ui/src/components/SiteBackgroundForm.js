import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ContentWrapper } from '../styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '../styles/typography'
import { Form, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../styles/forms'
import { mapDataForApi } from '../library/mapDataForApi'
import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '../validation/multiSelectWithOther'
import { questionMapping } from '../data/questionMapping'
import { siteBackground } from '../data/questions'
import CheckboxGroupWithLabelAndController from './CheckboxGroupWithLabelAndController'
import FormValidationMessageIfErrors from './FormValidationMessageIfErrors'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'
import QuestionNav from './QuestionNav'
import RequiredIndicator from './RequiredIndicator'
import useInitializeQuestionMappedForm from '../library/useInitializeQuestionMappedForm'
import useSiteInfo from '../library/useSiteInfo'

const SiteBackgroundForm = () => {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const [stakeholderTypesChecked, setStakeholderTypesChecked] = useState([])
  const { site_name } = useSiteInfo()
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`

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
    protectionStatus: multiselectWithOtherValidationNoMinimum,
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

    const initialStakeholderTypesChecked = initialStakeholders?.map(
      (stakeholder) => stakeholder.stakeholderType
    )
    setStakeholderTypesChecked(initialStakeholderTypesChecked)
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
    const stakeholderTypesCheckedCopy = [...stakeholderTypesChecked]
    if (event.target.checked) {
      stakeholdersAppend({ stakeholderType: stakeholder })
      stakeholderTypesCheckedCopy.push(stakeholder)
    } else {
      const fieldIndex = stakeholdersFields.findIndex(
        (field) => field.stakeholderType === stakeholder
      )
      const typeIndex = stakeholderTypesCheckedCopy.findIndex((type) => type === stakeholder)
      stakeholderTypesCheckedCopy.splice(typeIndex, 1)
      stakeholdersRemove(fieldIndex)
    }
    setStakeholderTypesChecked(stakeholderTypesCheckedCopy)
  }

  const getStakeholder = (stakeholder) =>
    stakeholdersFields.find((field) => field.stakeholderType === stakeholder)

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.siteBackground}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='site-background'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      {/* Select Stakeholders */}
      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>
            {siteBackground.stakeholders.question} <RequiredIndicator />
          </StickyFormLabel>
          <List>
            {siteBackground.stakeholders.options.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      checked={stakeholderTypesChecked.includes(stakeholder)}
                      onChange={(event) =>
                        handleStakeholdersOnChange(event, stakeholder)
                      }></Checkbox>
                    <Typography variant='subtitle'>{stakeholder}</Typography>
                  </Box>
                  <Box>
                    {getStakeholder(stakeholder) && stakeholder !== 'Unknown' ? (
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
                    ) : null}
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
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='protectionStatus'
            reactHookFormInstance={reactHookFormInstance}
            options={siteBackground.protectionStatus.options}
            question={siteBackground.protectionStatus.question}
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.protectionStatus?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
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
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='governmentArrangement'
            reactHookFormInstance={reactHookFormInstance}
            options={siteBackground.governmentArrangement.options}
            question={
              <>
                {siteBackground.governmentArrangement.question}
                <RequiredIndicator />
              </>
            }
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.governmentArrangement?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        {/* Land Tenure */}
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='landTenure'
            reactHookFormInstance={reactHookFormInstance}
            options={siteBackground.landTenure.options}
            question={
              <>
                {siteBackground.landTenure.question}
                <RequiredIndicator />
              </>
            }
            shouldAddOtherOptionWithClarification={true}
          />
          <ErrorText>{errors.landTenure?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
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
      </Form>
    </ContentWrapper>
  )
}

export default SiteBackgroundForm
