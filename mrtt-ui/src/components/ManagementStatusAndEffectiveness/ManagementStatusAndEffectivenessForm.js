import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useForm } from 'react-hook-form'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Box, MenuItem, Stack, TextField } from '@mui/material'

import { Form, FormPageHeader, FormQuestionDiv, StickyFormLabel } from '../../styles/forms'
import { ContentWrapper } from '../../styles/containers'
import { managementStatusAndEffectiveness as questions } from '../../data/questions'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../../validation/multiSelectWithOther'
import LoadingIndicator from '../LoadingIndicator'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import language from '../../language'
import { mapDataForApi } from '../../library/mapDataForApi'
import { questionMapping } from '../../data/questionMapping'

const ManagementStatusAndEffectivenessForm = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    dateOfAssessment: yup.string(),
    stakeholderManagement: multiselectWithOtherValidationNoMinimum,
    stakeholderInfluence: yup.string(),
    managementStatusChanges: yup.string(),
    currentManagementStatus: yup.string(),
    managementLaws: yup.string(),
    nameOfFormalManagementArea: yup.string(),
    projectStatusChange: yup.string(),
    currentProtectionStatus: yup.string(),
    financeForCiteManagement: yup.string(),
    sufficientFunds: yup.string(),
    resourcesToEnforceRegulations: yup.string(),
    equitableSharingOfSiteBenefits: yup.string(),
    climageChangeAdaptation: yup.string()
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
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const managementStatusChangesWatcher = watchForm('managementStatusChanges')
  const projectStatusChangeWatcher = watchForm('projectStatusChange')
  const financeForCiteManagementWatcher = watchForm('financeForCiteManagement')

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.managementStatusAndEffectiveness,
    resetForm,
    setIsLoading
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('managementStatusAndEffectiveness', formData))
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.submit)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.submit)
      })
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
        isSaving={isSubmitting}
        isSaveError={isSubmitError}
        onSave={validateInputs(handleSubmit)}
        currentSection='management-status-and-effectiveness'
      />
      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.dateOfAssessment.question}</StickyFormLabel>
          <Controller
            name='dateOfAssessment'
            control={control}
            defaultValue={new Date()}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='date-of-assessment'
                    label='date'
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue?.toISOString())
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
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
          <StickyFormLabel>{questions.sufficientFunds.question}</StickyFormLabel>
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
          <StickyFormLabel>{questions.climageChangeAdaptation.question}</StickyFormLabel>
          <Controller
            name='climageChangeAdaptation'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.climageChangeAdaptation.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.climageChangeAdaptation?.message}</ErrorText>
        </FormQuestionDiv>
      </Form>
    </ContentWrapper>
  )
}

export default ManagementStatusAndEffectivenessForm
