import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { Box, MenuItem, TextField } from '@mui/material'

import { FormLayout, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../../styles/forms'
import { ContentWrapper } from '../../styles/containers'
import { managementStatusAndEffectiveness as questions } from '../../data/questions'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../../validation/multiSelectWithOther'
import LoadingIndicator from '../LoadingIndicator'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import useInitializeMonitoringForm from '../../library/useInitializeMonitoringForm'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import language from '../../language'
import { mapDataForApi } from '../../library/mapDataForApi'
import { questionMapping } from '../../data/questionMapping'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import MONITORING_FORM_CONSTANTS from '../../constants/monitoringFormConstants'
import ButtonDeleteForm from '../ButtonDeleteForm'
import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import DatePickerUtcMui from '../DatePickerUtcMui'
import RequiredIndicator from '../RequiredIndicator'

const formType = MONITORING_FORM_CONSTANTS.managementStatusAndEffectiveness.payloadType

const ManagementStatusAndEffectivenessForm = () => {
  const { monitoringFormId } = useParams()
  const isEditMode = !!monitoringFormId
  const navigate = useNavigate()
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    dateOfAssessment: yup.string().required(language.form.required),
    stakeholderManagement: multiselectWithOtherValidationNoMinimum,
    stakeholderInfluence: yup.string(),
    managementStatusChanges: yup.string(),
    currentManagementStatus: yup.string().nullable(),
    managementLaws: yup.string().nullable(),
    nameOfFormalManagementArea: yup.string().nullable(),
    projectStatusChange: yup.string(),
    currentProtectionStatus: yup.string().nullable(),
    financeForCiteManagement: yup.string(),
    sufficientFunds: yup.string(),
    resourcesToEnforceRegulations: yup.string(),
    equitableSharingOfSiteBenefits: yup.string(),
    climateChangeAdaptation: yup.string()
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      stakeholderManagement: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    reset: resetForm,
    control,
    watch: watchForm
  } = reactHookFormInstance

  const { siteId } = useParams()
  const monitoringFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
  const monitoringFormSingularUrl = `${monitoringFormsUrl}/${monitoringFormId}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const managementStatusChangesWatcher = watchForm('managementStatusChanges')
  const projectStatusChangeWatcher = watchForm('projectStatusChange')
  const financeForCiteManagementWatcher = watchForm('financeForCiteManagement')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  useInitializeMonitoringForm({
    apiUrl: monitoringFormSingularUrl,
    formType,
    isEditMode,
    questionMapping: questionMapping.managementStatusAndEffectiveness,
    resetForm,
    setIsLoading
  })

  const createNewMonitoringForm = (payload) => {
    axios
      .post(monitoringFormsUrl, payload)
      .then(({ data }) => {
        setIsSubmitting(false)
        toast.success(language.success.getCreateThingSuccessMessage('This form'))
        navigate(data.id)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const editMonitoringForm = (payload) => {
    axios
      .put(monitoringFormSingularUrl, payload)
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.getEditThingSuccessMessage('This form'))
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
  }

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    const payload = {
      form_type: formType,
      answers: mapDataForApi('managementStatusAndEffectiveness', formData)
    }

    if (isEditMode) {
      editMonitoringForm(payload)
    } else {
      createNewMonitoringForm(payload)
    }
  }

  const handleDeleteConfirm = () => {
    setIsDeleting(true)
    axios
      .delete(monitoringFormSingularUrl)
      .then(() => {
        setIsDeleting(false)
        toast.success(language.success.getDeleteThingSuccessMessage('That form'))
        navigate(`/sites/${siteId}/overview`)
      })
      .catch(() => {
        toast.error(language.error.delete)
        setIsDeleting(false)
      })
  }

  const handleDeleteClick = () => {
    setIsDeleteConfirmPromptOpen(true)
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.managementStatusAndEffectiveness}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='management-status-and-effectiveness'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel>
            {questions.dateOfAssessment.question}
            <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='dateOfAssessment'
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <DatePickerUtcMui id='date-of-assessment' label='date' field={field} />
            )}
          />
          <ErrorText>{errors.dateOfAssessment?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='stakeholderManagement'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.stakeholderManagement.options}
            question={questions.stakeholderManagement.question}
            shouldAddOtherOptionWithClarification={true}
          />
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.stakeholderInfluence.question}</StickyFormLabel>
          <Controller
            name='stakeholderInfluence'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.stakeholderInfluence.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.stakeholderInfluence?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.managementStatusChanges.question}</StickyFormLabel>
          <Controller
            name='managementStatusChanges'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.managementStatusChanges.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.managementStatusChanges?.message}</ErrorText>
        </FormQuestionDiv>
        {managementStatusChangesWatcher === 'Yes' ? (
          <div>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.currentManagementStatus.question}</StickyFormLabel>
              <Controller
                name='currentManagementStatus'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.currentManagementStatus.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.currentManagementStatus?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.managementLaws.question}</StickyFormLabel>
              <Controller
                name='managementLaws'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.managementLaws.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.managementLaws?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.nameOfFormalManagementArea.question}</StickyFormLabel>
              <Controller
                name='nameOfFormalManagementArea'
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='enter name'></TextField>
                )}
              />
            </FormQuestionDiv>
          </div>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.projectStatusChange.question}</StickyFormLabel>
          <Controller
            name='projectStatusChange'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.projectStatusChange.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.projectStatusChange?.message}</ErrorText>
        </FormQuestionDiv>
        {projectStatusChangeWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.currentProtectionStatus.question}</StickyFormLabel>
            <Controller
              name='currentProtectionStatus'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField {...field} select value={field.value} label='select'>
                  {questions.currentProtectionStatus.options.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <ErrorText>{errors.currentProtectionStatus?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.financeForCiteManagement.question}</StickyFormLabel>
          <Controller
            name='financeForCiteManagement'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.financeForCiteManagement.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.financeForCiteManagement?.message}</ErrorText>
          {financeForCiteManagementWatcher === 'Other' ? (
            <Box sx={{ marginTop: '1em' }}>
              <Controller
                name='nameOfFormalManagementArea'
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='enter name'></TextField>
                )}
              />
            </Box>
          ) : null}
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.sufficientFunds.question}</StickyFormLabel>
          <Controller
            name='sufficientFunds'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.sufficientFunds.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.sufficientFunds?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.resourcesToEnforceRegulations.question}</StickyFormLabel>
          <Controller
            name='resourcesToEnforceRegulations'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.resourcesToEnforceRegulations.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.resourcesToEnforceRegulations?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.equitableSharingOfSiteBenefits.question}</StickyFormLabel>
          <Controller
            name='equitableSharingOfSiteBenefits'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.equitableSharingOfSiteBenefits.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.equitableSharingOfSiteBenefits?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.climateChangeAdaptation.question}</StickyFormLabel>
          <Controller
            name='climateChangeAdaptation'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.climateChangeAdaptation.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.climateChangeAdaptation?.message}</ErrorText>
        </FormQuestionDiv>
      </FormLayout>
      {isEditMode ? <ButtonDeleteForm onClick={handleDeleteClick} isDeleting={isDeleting} /> : null}
      <ConfirmPrompt
        isOpen={isDeleteConfirmPromptOpen}
        setIsOpen={setIsDeleteConfirmPromptOpen}
        title={language.form.deletePrompt.title}
        promptText={language.form.deletePrompt.promptText}
        confirmButtonText={language.form.deletePrompt.buttonText}
        onConfirm={handleDeleteConfirm}
      />
    </ContentWrapper>
  )
}

export default ManagementStatusAndEffectivenessForm
