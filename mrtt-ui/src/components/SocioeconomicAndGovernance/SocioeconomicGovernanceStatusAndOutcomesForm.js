'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { Controller, useFormContext, useFieldArray } from 'react-hook-form'
import { Box, Checkbox, FormControlLabel, ListItem, MenuItem, TextField } from '@mui/material'

import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  NestedLabel1,
  StickyFormLabel
} from '@/styles/forms'
import QuestionNav from '@/components/QuestionNav'
import useSiteInfo from '@/library/useSiteInfo'
import language from '@/language'
import { ContentWrapper } from '@/styles/containers'
import { ErrorText, PageSubtitle, PageTitle } from '@/styles/typography'
import { socioeconomicGovernanceStatusOutcomes as questions } from '@/data/questions'
import LoadingIndicator from '@/components/LoadingIndicator'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import CheckboxGroupWithLabelAndController from '@/components/CheckboxGroupWithLabelAndController'
import { socioIndicators } from '@/data/socioIndicators'
import { findRegistationDataItem } from '@/library/findDataItems'
import SocioeconomicOutcomesRow from './SocioeconomicOutcomesRow'
import ButtonDeleteForm from '@/components/ButtonDeleteForm'
import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import DatePickerUtcMui from '@/components/DatePickerUtcMui'
import RequiredIndicator from '@/components/RequiredIndicator'
import { useLoadErrorToast } from '@/hooks/useLoadErrorToast'
import { siteQueries, useDeleteMonitor } from '@/queries/sites'

const getSocioeconomicAims = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '3.2') ?? []

const SocioeconomicGovernanceStatusAndOutcomesForm = () => {
  const router = useRouter()
  const { monitoringFormId } = useParams()
  const isEditMode = !!monitoringFormId
  const { site_name } = useSiteInfo()

  const form = useFormContext()

  const {
    formState: { errors },
    control,
    watch: watchForm
  } = form

  const {
    fields: socioeconomicOutcomesFields,
    append: socioeconomicOutcomesAppend,
    remove: socioeconomicOutcomesRemove,
    update: socioeconomicOutcomesUpdate
  } = useFieldArray({ name: 'socioeconomicOutcomes', control })

  const { siteId } = useParams()
  const registrationQuery = useQuery({ ...siteQueries.registration(siteId), enabled: !!siteId })
  useLoadErrorToast(registrationQuery.error)
  const areSociologicalAimsLoading = registrationQuery.isLoading
  const socioeconomicAimsAnswer = getSocioeconomicAims(registrationQuery.data)
  const socioeconomicAims = socioeconomicAimsAnswer.selectedValues?.length
    ? [
        ...socioeconomicAimsAnswer.selectedValues,
        'Not applicable',
        ...(socioeconomicAimsAnswer.otherValue ? [socioeconomicAimsAnswer.otherValue] : [])
      ]
    : []
  const deleteMonitor = useDeleteMonitor(siteId)
  const isDeleting = deleteMonitor.isPending

  const changeInGovernanceWatcher = watchForm('changeInGovernance')
  const changeInTenureArrangementWatcher = watchForm('changeInTenureArrangement')
  const socioeconomicOutcomesWatcher = watchForm('socioeconomicOutcomes')
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  // const { data, isLoading } = useInitializeQuestionMappedFormMonitors({
  //   key: 'socioeconomicGovernanceStatusAndOutcomes',
  //   siteId,
  //   monitorId: isEditMode ? monitoringFormId : undefined,
  //   form,
  // })

  // const handleSubmit = (formData) => {
  //   setIsSubmitting(true)
  //   setIsSubmitError(false)

  //   const payload = {
  //     form_type: formType,
  //     answers: mapDataForApi('socioeconomicGovernanceStatusAndOutcomes', formData)
  //   }

  //   if (isEditMode) {
  //     editMonitoringForm(payload)
  //   } else {
  //     createNewMonitoringForm(payload)
  //   }
  // }

  const handleDeleteConfirm = () => {
    deleteMonitor.mutate(monitoringFormId, {
      onSuccess: () => {
        toast.success(language.success.getDeleteThingSuccessMessage('That form'))
        router.push(`/sites/${siteId}/overview`)
      },
      onError: () => toast.error(language.error.delete)
    })
  }

  const handleDeleteClick = () => {
    setIsDeleteConfirmPromptOpen(true)
  }

  const getSocioEconomicFieldsIndex = (indicator) =>
    socioeconomicOutcomesFields.findIndex((socioIndicator) => socioIndicator.child === indicator)

  const handleSocioIndicatorsOnChange = ({ event, indicator, childSocioIndicator }) => {
    const indicatorIndex = getSocioEconomicFieldsIndex(childSocioIndicator)

    if (event.target.checked) {
      socioeconomicOutcomesAppend({
        mainLabel: indicator.label,
        secondaryLabel: indicator.secondaryLabel,
        child: childSocioIndicator,
        type: '',
        trend: '',
        linkedAims: [],
        measurement: '',
        unit: '',
        comparison: '',
        value: ''
      })
    } else if (!event.target.checked) {
      socioeconomicOutcomesRemove(indicatorIndex)
    }
  }

  const updateSocioeconomicOutcome = ({
    index,
    currentType,
    currentTrend,
    currentLinkedAims,
    currentMeasurement,
    currentUnit,
    currentComparison,
    currentValue
  }) => {
    const currentItem = socioeconomicOutcomesFields[index]

    if (currentType) currentItem.type = currentType
    if (currentTrend) currentItem.trend = currentTrend
    if (currentLinkedAims) currentItem.linkedAims = currentLinkedAims
    if (currentMeasurement) currentItem.measurement = currentMeasurement
    if (currentUnit) currentItem.unit = currentUnit
    if (currentComparison) currentItem.comparison = currentComparison
    if (currentValue) currentItem.value = currentValue

    socioeconomicOutcomesUpdate(index, currentItem)
  }

  return areSociologicalAimsLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.socioeconomicGovernanceStatusOutcomes}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={false}
        isFormSaveError={false}
        currentSection='socioeconomic-and-governance-status'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel>
            {questions.dateOfOutcomesAssessment.question}
            <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='dateOfOutcomesAssessment'
            control={control}
            render={({ field }) => (
              <DatePickerUtcMui id='dateOfOutcomesAssessment' label='date' field={field} />
            )}
          />
          <ErrorText>{errors.dateOfOutcomesAssessment?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.changeInGovernance.question}</StickyFormLabel>
          <Controller
            name='changeInGovernance'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.changeInGovernance.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.changeInGovernance?.message}</ErrorText>
        </FormQuestionDiv>
        {changeInGovernanceWatcher === 'Yes' ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='currentGovenance'
              control={control}
              options={questions.currentGovenance.options}
              question={questions.currentGovenance.question}
              shouldAddOtherOptionWithClarification={false}
            />
            <ErrorText>{errors.currentGovenance?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.changeInTenureArrangement.question}</StickyFormLabel>
          <Controller
            name='changeInTenureArrangement'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.changeInTenureArrangement.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.changeInTenureArrangement?.message}</ErrorText>
        </FormQuestionDiv>
        {changeInTenureArrangementWatcher === 'Yes' ? (
          <div>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='currentLandOwnership'
                control={control}
                options={questions.currentLandOwnership.options}
                question={questions.currentLandOwnership.question}
                shouldAddOtherOptionWithClarification={true}
              />
              <ErrorText>{errors.currentLandOwnership?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.rightsToLandInLaw.question}</StickyFormLabel>
              <Controller
                name='rightsToLandInLaw'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} select value={field.value} label='select'>
                    {questions.rightsToLandInLaw.options.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <ErrorText>{errors.rightsToLandInLaw?.message}</ErrorText>
            </FormQuestionDiv>
          </div>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.socioeconomicOutcomes.question}</StickyFormLabel>
          {socioIndicators.map((indicator, indicatorIndex) => (
            <Box key={indicatorIndex}>
              <NestedLabel1>{`${indicator.label}: ${indicator.secondaryLabel}`}</NestedLabel1>
              {indicator.children.map((childSocioIndicator, childIndex) => (
                <ListItem key={childIndex}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={childSocioIndicator}
                        checked={getSocioEconomicFieldsIndex(childSocioIndicator) !== -1}
                        onChange={(event) =>
                          handleSocioIndicatorsOnChange({
                            event,
                            indicator,
                            childSocioIndicator
                          })
                        }></Checkbox>
                    }
                    label={childSocioIndicator}
                  />
                </ListItem>
              ))}
            </Box>
          ))}
        </FormQuestionDiv>
        {socioeconomicOutcomesWatcher?.length > 0 ? (
          <FormQuestionDiv>
            <StickyFormLabel>
              {questions.socioeconomicOutcomesAdditionalData.question}
            </StickyFormLabel>
            {socioeconomicOutcomesFields?.length > 0
              ? socioeconomicOutcomesFields?.map((item, index) => (
                  <SocioeconomicOutcomesRow
                    key={index}
                    index={index}
                    outcome={item.child}
                    type={item.type}
                    trend={item.trend}
                    linkedAims={item.linkedAims}
                    measurement={item.measurement}
                    unit={item.unit}
                    comparison={item.comparison}
                    value={item.value}
                    selectedAims={socioeconomicAims}
                    updateItem={updateSocioeconomicOutcome}></SocioeconomicOutcomesRow>
                ))
              : null}
            <ErrorText>{errors.socioeconomicOutcomes?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.achievementOfSocioeconomicAims.question}</StickyFormLabel>
          <Controller
            name='achievementOfSocioeconomicAims'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.achievementOfSocioeconomicAims.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.achievementOfSocioeconomicAims?.message}</ErrorText>
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

export default SocioeconomicGovernanceStatusAndOutcomesForm
