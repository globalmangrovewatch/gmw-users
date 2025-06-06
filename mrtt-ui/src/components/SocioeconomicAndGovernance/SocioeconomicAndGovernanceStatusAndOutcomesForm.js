import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import axios from 'axios'
import { toast } from 'react-toastify'

import { Controller, useFormContext, useFieldArray } from 'react-hook-form'
import { Box, Checkbox, FormControlLabel, ListItem, MenuItem, TextField } from '@mui/material'

import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  NestedLabel1,
  StickyFormLabel
} from '../../styles/forms'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import language from '../../language'
import { ContentWrapper } from '../../styles/containers'
import { questionMapping } from '../../data/questionMapping'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { mapDataForApi } from '../../library/mapDataForApi'
import { socioeconomicGovernanceStatusOutcomes as questions } from '../../data/questions'
import LoadingIndicator from '../LoadingIndicator'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { socioIndicators } from '../../data/socioIndicators'
import { findRegistationDataItem } from '../../library/findDataItems'
import SocioeconomicOutcomesRow from './SocioeconomicOutcomesRow'
import useInitializeMonitoringForm from '../../library/useInitializeMonitoringForm'
import MONITORING_FORM_CONSTANTS from '../../constants/monitoringFormConstants'
import ButtonDeleteForm from '../ButtonDeleteForm'
import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import DatePickerUtcMui from '../DatePickerUtcMui'
import RequiredIndicator from '../RequiredIndicator'

const getSocioeconomicAims = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '3.2') ?? []

const formType = MONITORING_FORM_CONSTANTS.socioeconomicGovernanceStatusAndOutcomes.payloadType

const SocioeconomicAndGovernanceStatusAndOutcomesForm = () => {
  const navigate = useNavigate()
  const { monitoringFormId } = useParams()
  const isEditMode = !!monitoringFormId
  const { site_name } = useSiteInfo()

  const form = useFormContext()

  const {
    handleSubmit: validateInputs,
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
  const monitoringFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
  const monitoringFormSingularUrl = `${monitoringFormsUrl}/${monitoringFormId}`
  const registrationInterventionFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const changeInGovernanceWatcher = watchForm('changeInGovernance')
  const changeInTenureArrangementWatcher = watchForm('changeInTenureArrangement')
  const socioeconomicOutcomesWatcher = watchForm('socioeconomicOutcomes')
  const [socioeconomicAims, setSocioeconomicAims] = useState([])
  const [isMainFormDataLoading, setIsMainFormDataLoading] = useState(false)
  const [areSociologicalAimsLoading, setAreSociologicalAimsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)

  useEffect(
    function loadSocioeconomicAims() {
      setAreSociologicalAimsLoading(true)
      axios
        .get(registrationInterventionFormsUrl)
        .then((registrationInterventionResponse) => {
          setAreSociologicalAimsLoading(false)
          const socioeconomicAimsInitialVal = getSocioeconomicAims(registrationInterventionResponse)
          if (socioeconomicAimsInitialVal.selectedValues?.length > 0) {
            const socioeconomicAimsFlattened = socioeconomicAimsInitialVal.selectedValues
            socioeconomicAimsFlattened.push('Not applicable')
            if (socioeconomicAimsInitialVal.otherValue) {
              socioeconomicAimsFlattened.push(socioeconomicAimsInitialVal.otherValue)
            }
            setSocioeconomicAims(socioeconomicAimsFlattened)
          }
        })
        .catch(() => {
          setAreSociologicalAimsLoading(false)
          toast.error(language.error.apiLoad)
        })
    },
    [registrationInterventionFormsUrl]
  )

  useInitializeMonitoringForm({
    apiUrl: monitoringFormSingularUrl,
    formType,
    isEditMode,
    questionMapping: questionMapping.socioeconomicAndGovernanceStatusAndOutcomes,
    setIsLoading: setIsMainFormDataLoading
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
      answers: mapDataForApi('socioeconomicAndGovernanceStatusAndOutcomes', formData)
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

  return isMainFormDataLoading || areSociologicalAimsLoading ? (
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
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
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
            defaultValue={null}
            render={({ field }) => (
              <DatePickerUtcMui id='date-of-outcomes-assessment' label='date' field={field} />
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

export default SocioeconomicAndGovernanceStatusAndOutcomesForm
