import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { Box, MenuItem, TextField } from '@mui/material'

import { FormLayout, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../../styles/forms'
import { ContentWrapper } from '../../styles/containers'
import { managementStatusAndEffectiveness as questions } from '../../data/questions'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
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

import { useInitializeQuestionMappedForm } from '../../library/question-mapped-form/useInitializeQuestionMappedForm'
import LoadingIndicator from '../LoadingIndicator'

const formType = MONITORING_FORM_CONSTANTS.managementStatusAndEffectiveness.payloadType

const ManagementStatusAndEffectivenessForm = () => {
  const { monitoringFormId, siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`
  const isEditMode = !!monitoringFormId
  const navigate = useNavigate()
  const { site_name } = useSiteInfo()

  const form = useFormContext()

  const {
    // handleSubmit: validateInputs,
    formState: { errors },
    control
  } = form

  const monitoringFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
  const monitoringFormSingularUrl = `${monitoringFormsUrl}/${monitoringFormId}`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const managementStatusChangesWatcher = useWatch({ control, name: 'managementStatusChanges' })
  const projectStatusChangeWatcher = useWatch({ control, name: 'projectStatusChange' })
  const financeForCiteManagementWatcher = useWatch({ control, name: 'financeForCiteManagement' })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  const { data, isLoading } = useInitializeQuestionMappedForm({
    key: 'managementStatusAndEffectiveness',
    apiUrl: apiAnswersUrl,
    resetForm: form.reset,
    questionMapping,
    queryOptions: {
      refetchOnMount: 'always',
      staleTime: 0,
      refetchOnWindowFocus: false
    }
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
        setIsError(true)
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
        setIsError(true)
        toast.error(language.error.submit)
      })
  }

  // const handleSubmit = async (formData) => {
  //   const fields = Object.keys(questionMapping['managementStatusAndEffectiveness'])
  //   const ok = await form.trigger(fields, { shouldFocus: true })
  //   if (!ok) {
  //     setIsError(true)
  //     toast.error(language.error.validation)
  //     return
  //   }
  //   setIsSubmitting(true)
  //   setIsError(false)
  //   if (!formData) return

  //   const payload = {
  //     form_type: formType,
  //     answers: mapDataForApi('managementStatusAndEffectiveness', formData)
  //   }

  //   if (isEditMode) {
  //     editMonitoringForm(payload)
  //   } else {
  //     createNewMonitoringForm(payload)
  //   }
  // }

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
        isFormSaveError={isError}
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
            render={({ field }) => (
              <DatePickerUtcMui id='dateOfAssessment' label='date' field={field} />
            )}
          />
          <ErrorText>{errors.dateOfAssessment?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='stakeholderManagement'
            control={control}
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
