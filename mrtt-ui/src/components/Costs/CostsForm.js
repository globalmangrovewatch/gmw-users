import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { Box, Button, MenuItem, TextField } from '@mui/material'

import {
  Form,
  FormPageHeader,
  FormQuestionDiv,
  QuestionSubSection,
  StickyFormLabel
} from '../../styles/forms'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import language from '../../language'
import { ContentWrapper } from '../../styles/containers'
import { costs as questions } from '../../data/questions'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../../validation/multiSelectWithOther'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { mapDataForApi } from '../../library/mapDataForApi'
import { questionMapping } from '../../data/questionMapping'
import LoadingIndicator from '../LoadingIndicator'
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'
import AddProjectFunderNamesRow from './AddProjectFunderNamesRow'
import ProjectFunderNamesRow from './ProjectFunderNamesRow'
import BreakdownOfCostRow from './BreakdownOfCostRow'
import PercentageSplitOfActivitiesRow from './PercentageSplitOfActivitiesRow'
import { currencies } from '../../data/currencies'
import { findDataItem } from '../../library/findDataItem'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'

const getEndDate = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '1.1b') ?? ''

const getBreakdownOfCost = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '7.5') ?? []

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.2a') ?? []

const getOtherActivitiesImplemented = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '6.4') ?? []

const getPercentageSplitOfActivities = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '7.5a') ?? []

const CostsForm = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    supportForActivities: multiselectWithOtherValidationNoMinimum,
    projectInterventionFunding: yup
      .object()
      .shape({
        fundingType: yup.string(),
        other: yup.string()
      })
      .default([]),
    projectFunderNames: yup
      .array()
      .of(
        yup.object().shape({
          funderName: yup.string(),
          funderType: yup.string(),
          percentage: yup.mixed()
        })
      )
      .default([]),
    breakdownOfCost: yup
      .array()
      .of(
        yup.object().shape({
          costType: yup.string(),
          cost: yup.mixed(),
          currency: yup.string()
        })
      )
      .default([]),
    costOfProjectActivities: yup.object().shape({
      cost: yup.mixed(),
      currency: yup.string()
    }),
    percentageSplitOfActivities: yup
      .array()
      .of(
        yup.object().shape({
          intervention: yup.string(),
          percentage: yup.mixed().nullable()
        })
      )
      .default([]),
    nonmonetisedContributions: multiselectWithOtherValidationNoMinimum
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      supportForActivities: { selectedValues: [], otherValue: undefined },
      nonmonetisedContributions: { selectedValues: [], otherValue: undefined }
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

  const {
    fields: projectFunderNamesFields,
    append: projectFunderNamesAppend,
    remove: projectFunderNamesRemove,
    update: projectFunderNamesUpdate
  } = useFieldArray({ name: 'projectFunderNames', control })

  const {
    fields: breakdownOfCostFields,
    update: breakdownOfCostUpdate,
    replace: breakdownOfCostReplace
  } = useFieldArray({ name: 'breakdownOfCost', control })

  const {
    fields: percentageSplitOfActivitiesFields,
    replace: percentageSplitOfActivitiesReplace,
    update: percentageSplitOfActivitiesUpdate
  } = useFieldArray({ name: 'percentageSplitOfActivities', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const projectInterventionFundingWatcher = watchForm('projectInterventionFunding')
  const supportForActivitiesWatcher = watchForm('supportForActivities')
  const [showAddTabularInputRow, setShowAddTabularInputRow] = useState(false)
  const [hasEndDate, setHasEndDate] = useState(false)

  const loadServerData = useCallback(
    (serverResponse) => {
      const endDateResponse = getEndDate(serverResponse)
      if (endDateResponse) setHasEndDate(true)

      const defaultProjectActivities = [
        { costType: 'Project planning & management' },
        { costType: 'Biophysical interventions' },
        { costType: 'Community activities' },
        { costType: 'Site maintenance' },
        { costType: 'Monitoring' },
        { costType: 'Other costs' }
      ]

      const breakdownOfCostInitialVal = getBreakdownOfCost(serverResponse)

      if (breakdownOfCostInitialVal.length === 0) {
        breakdownOfCostReplace(defaultProjectActivities)
      }

      const biophysicalInterventionsInitialVal = getBiophysicalInterventions(serverResponse)
      const otherActivitiesImplementedInitialVal = getOtherActivitiesImplemented(serverResponse)
      const percentageSplitOfActivitiesInitialVal = getPercentageSplitOfActivities(serverResponse)

      if (percentageSplitOfActivitiesInitialVal.length === 0) {
        let interventionTypes = []
        let otherInterventionActivities = []
        let combinedInterventions = []

        if (biophysicalInterventionsInitialVal.length) {
          interventionTypes = biophysicalInterventionsInitialVal.map(
            (item) => item.interventionType
          )
        }

        if (otherActivitiesImplementedInitialVal.selectedValues.length) {
          otherInterventionActivities = otherActivitiesImplementedInitialVal.selectedValues
        }
        if (
          otherActivitiesImplementedInitialVal.isOtherChecked === true &&
          otherActivitiesImplementedInitialVal.otherValue.length
        ) {
          otherInterventionActivities.push(otherActivitiesImplementedInitialVal.otherValue)
        }
        combinedInterventions = interventionTypes.concat(otherInterventionActivities)

        const filteredCombinedInterventions = combinedInterventions.filter(
          (item) => item !== 'None'
        )

        let preppedSplitOfActivitiesFields = []

        filteredCombinedInterventions.forEach((item) =>
          preppedSplitOfActivitiesFields.push({ intervention: item })
        )
        percentageSplitOfActivitiesReplace(preppedSplitOfActivitiesFields)
      }
    },
    [breakdownOfCostReplace, percentageSplitOfActivitiesReplace]
  )

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.costs,
    resetForm,
    setIsLoading,
    successCallback: loadServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('costs', formData))
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

  const updateTabularInputDisplay = (boolean) => {
    return setShowAddTabularInputRow(boolean)
  }

  const saveProjectFunderNamesItem = (funderName, funderType, percentage) => {
    projectFunderNamesAppend({
      funderName,
      funderType,
      percentage
    })
  }

  const deleteProjectFunderNamesItem = (index) => {
    projectFunderNamesRemove(index)
  }

  const updateProjectFunderNamesItem = (index, funderType, percentage) => {
    const currentItem = projectFunderNamesFields[index]
    currentItem.funderType = funderType
    currentItem.percentage = percentage
    projectFunderNamesUpdate(index, currentItem)
  }

  const updateBreakdownOfCostItem = (index, cost, currency) => {
    const currentItem = breakdownOfCostFields[index]
    currentItem.cost = cost
    currentItem.currency = currency
    breakdownOfCostUpdate(index, currentItem)
  }

  const updatePercentageSplitOfActivities = (index, percentage) => {
    const currentItem = percentageSplitOfActivitiesFields[index]
    currentItem.percentage = percentage
    percentageSplitOfActivitiesUpdate(index, currentItem)
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>{language.pages.siteQuestionsOverview.formName.costs}</PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='costs'
      />
      <FormValidationMessageIfErrors formErrors={errors} />
      <Form>
        <FormQuestionDiv>
          <CheckboxGroupWithLabelAndController
            fieldName='supportForActivities'
            reactHookFormInstance={reactHookFormInstance}
            options={questions.supportForActivities.options}
            question={questions.supportForActivities.question}
            shouldAddOtherOptionWithClarification={false}
          />
          <ErrorText>{errors.supportForActivities?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.projectInterventionFunding.question}</StickyFormLabel>
          <Controller
            name='projectInterventionFunding.fundingType'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.projectInterventionFunding.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.projectInterventionFunding?.fundingType?.message}</ErrorText>
          {projectInterventionFundingWatcher?.fundingType === 'Other' ? (
            <QuestionSubSection>
              <Controller
                name='projectInterventionFunding.other'
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='please state other'></TextField>
                )}
              />
              <ErrorText>{errors.projectInterventionFunding?.other?.message}</ErrorText>
            </QuestionSubSection>
          ) : null}
        </FormQuestionDiv>
        {supportForActivitiesWatcher?.selectedValues?.includes('Monetary') ? (
          <div>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.projectFunderNames.question}</StickyFormLabel>
              {projectFunderNamesFields?.length > 0
                ? projectFunderNamesFields.map((item, itemIndex) => (
                    <ProjectFunderNamesRow
                      key={itemIndex}
                      label={item.funderName}
                      type={item.funderType}
                      percentage={item.percentage}
                      index={itemIndex}
                      deleteItem={deleteProjectFunderNamesItem}
                      updateItem={updateProjectFunderNamesItem}></ProjectFunderNamesRow>
                  ))
                : null}
              <ErrorText>{errors.projectFunderNames?.message}</ErrorText>
              {showAddTabularInputRow ? (
                <AddProjectFunderNamesRow
                  saveItem={saveProjectFunderNamesItem}
                  updateTabularInputDisplay={updateTabularInputDisplay}></AddProjectFunderNamesRow>
              ) : null}
              {!showAddTabularInputRow ? (
                <Button sx={{ marginTop: '1.5em' }} onClick={() => setShowAddTabularInputRow(true)}>
                  + Add measurement row
                </Button>
              ) : null}
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>
                {hasEndDate
                  ? questions.costOfProjectActivities.question
                  : '7.4 What is the total cost of the project activities at the site to date?'}
              </StickyFormLabel>
              <Box sx={{ marginTop: '1em' }}>
                <Controller
                  name='costOfProjectActivities.cost'
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <TextField {...field} value={field.value} label='enter cost'></TextField>
                  )}
                />
                <Controller
                  name='costOfProjectActivities.currency'
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      sx={{ width: '8em', marginLeft: '1em' }}
                      value={field.value}
                      label='currency'>
                      {currencies.map((currency, index) => (
                        <MenuItem key={index} value={currency.code}>
                          {currency.code}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Box>
              <ErrorText>{errors.costOfProjectActivities?.cost?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.breakdownOfCost.question}</StickyFormLabel>
              {breakdownOfCostFields?.length > 0
                ? breakdownOfCostFields?.map((item, itemIndex) => (
                    <BreakdownOfCostRow
                      key={itemIndex}
                      label={item.costType}
                      cost={item.cost}
                      currency={item.currency}
                      index={itemIndex}
                      updateItem={updateBreakdownOfCostItem}></BreakdownOfCostRow>
                  ))
                : null}
            </FormQuestionDiv>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.percentageSplitOfActivities.question}</StickyFormLabel>
              {percentageSplitOfActivitiesFields?.length > 0 ? (
                percentageSplitOfActivitiesFields?.map((item, itemIndex) => (
                  <PercentageSplitOfActivitiesRow
                    key={itemIndex}
                    label={item.intervention}
                    percentage={item.percentage}
                    index={itemIndex}
                    updateItem={updatePercentageSplitOfActivities}></PercentageSplitOfActivitiesRow>
                ))
              ) : (
                <ErrorText>{`No interventions selected in 6.2a & 6.4`}</ErrorText>
              )}
            </FormQuestionDiv>
          </div>
        ) : null}
        {supportForActivitiesWatcher?.selectedValues?.includes('Voluntary/Non-monetary') ? (
          <FormQuestionDiv>
            <CheckboxGroupWithLabelAndController
              fieldName='nonmonetisedContributions'
              reactHookFormInstance={reactHookFormInstance}
              options={questions.nonmonetisedContributions.options}
              question={questions.nonmonetisedContributions.question}
              shouldAddOtherOptionWithClarification={true}
            />
            <ErrorText>{errors.nonmonetisedContributions?.selectedValues?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
      </Form>
    </ContentWrapper>
  )
}

CostsForm.propTypes = {}

export default CostsForm
