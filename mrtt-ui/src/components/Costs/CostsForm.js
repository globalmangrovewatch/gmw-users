import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { Button, MenuItem, TextField } from '@mui/material'

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

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const projectInterventionFundingWatcher = watchForm('projectInterventionFunding')
  const [showAddTabularInputRow, setShowAddTabularInputRow] = useState(false)

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.costs,
    resetForm,
    setIsLoading
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

  const saveItem = (funderName, funderType, percentage) => {
    projectFunderNamesAppend({
      funderName,
      funderType,
      percentage
    })
  }

  const deleteItem = (index) => {
    projectFunderNamesRemove(index)
  }

  const updateItem = (index, funderName, funderType, percentage) => {
    const currentItem = projectFunderNamesFields[index]
    if (funderName) currentItem.funderName = funderName
    if (funderType) currentItem.funderType = funderType
    if (percentage) currentItem.percentage = percentage
    projectFunderNamesUpdate(index, currentItem)
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
        isSaving={isSubmitting}
        isSaveError={isSubmitError}
        onSave={validateInputs(handleSubmit)}
        currentSection='costs'
      />
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
        <FormQuestionDiv>
          <StickyFormLabel>{questions.projectFunderNames.question}</StickyFormLabel>
          {projectFunderNamesFields?.length > 0
            ? projectFunderNamesFields.map((item, itemIndex) => (
                <ProjectFunderNamesRow
                  key={itemIndex}
                  label={item.funderName}
                  rowValue1={item.funderType}
                  rowValue2={item.percentage}
                  index={itemIndex}
                  deleteItem={deleteItem}
                  updateItem={updateItem}></ProjectFunderNamesRow>
              ))
            : null}
          <ErrorText>{errors.projectFunderNames?.message}</ErrorText>
          {showAddTabularInputRow ? (
            <AddProjectFunderNamesRow
              saveItem={saveItem}
              updateTabularInputDisplay={updateTabularInputDisplay}></AddProjectFunderNamesRow>
          ) : null}
          {!showAddTabularInputRow ? (
            <Button sx={{ marginTop: '1.5em' }} onClick={() => setShowAddTabularInputRow(true)}>
              + Add measurement row
            </Button>
          ) : null}
        </FormQuestionDiv>
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
      </Form>
    </ContentWrapper>
  )
}

CostsForm.propTypes = {}

export default CostsForm
