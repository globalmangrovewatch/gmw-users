import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Controller, useFormContext, useFieldArray } from 'react-hook-form'
import {
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'

import {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  InnerFormDiv,
  NestedLabel1,
  QuestionSubSection,
  StickyFormLabel
} from '../../styles/forms'
import QuestionNav from '../QuestionNav'
import useSiteInfo from '../../library/useSiteInfo'
import language from '../../language'
import { ContentWrapper } from '../../styles/containers'
import { questionMapping } from '../../data/questionMapping'
import { ErrorText, PageSubtitle, PageTitle } from '../../styles/typography'
import { mapDataForApi } from '../../library/mapDataForApi'
import { ecologicalStatusOutcomes as questions } from '../../data/questions'
import FormValidationMessageIfErrors from '../FormValidationMessageIfErrors'
import useInitializeMonitoringForm from '../../library/useInitializeMonitoringForm'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { findRegistationDataItem, findMonitoringDataItem } from '../../library/findDataItems'
import MONITORING_FORM_CONSTANTS from '../../constants/monitoringFormConstants'
import { monitoringIndicators } from '../../data/monitoringIndicators'
import ButtonDeleteForm from '../ButtonDeleteForm'
import ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt'
import EcologicalOutcomesRow from './EcologicalOutcomesRow'
import DatePickerUtcMui from '../DatePickerUtcMui'
import { unitOptions } from '../../data/ecologicalOptions'
import RequiredIndicator from '../RequiredIndicator'

const getEcologicalAims = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '3.1') ?? []

const getBiophysicalInterventions = (registrationAnswersFromServer) =>
  findRegistationDataItem(registrationAnswersFromServer, '6.2') ?? []

const getEcologicalMonitoringStakeholders = (registrationAnswersFromServer) =>
  findMonitoringDataItem(registrationAnswersFromServer, '10.2') ?? []

const formType = MONITORING_FORM_CONSTANTS.ecologicalStatusAndOutcomes.payloadType

const EcologicalStatusAndOutcomesForm = () => {
  const { site_name } = useSiteInfo()
  const { monitoringFormId } = useParams()
  const isEditMode = !!monitoringFormId
  const navigate = useNavigate()

  const form = useFormContext()

  const {
    handleSubmit: validateInputs,
    formState: { errors },
    control,
    watch: watchForm
  } = form

  const {
    fields: monitoringIndicatorsFields,
    append: monitoringIndicatorsAppend,
    remove: monitoringIndicatorsRemove,
    update: monitoringIndicatorsUpdate
  } = useFieldArray({ name: 'monitoringIndicators', control })

  const {
    fields: ecologicalMonitoringStakeholdersFields,
    append: ecologicalMonitoringStakeholdersAppend,
    remove: ecologicalMonitoringStakeholdersRemove
  } = useFieldArray({ name: 'ecologicalMonitoringStakeholders', control })

  const { siteId } = useParams()
  const monitoringFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
  const monitoringFormSingularUrl = `${monitoringFormsUrl}/${monitoringFormId}`
  const registrationInterventionFormsUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [biophysicalInterventions, setBiophysicalInterventions] = useState([])
  const mangroveAreaIncreaseWatcher = watchForm('mangroveAreaIncrease')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteConfirmPromptOpen, setIsDeleteConfirmPromptOpen] = useState(false)
  const monitoringIndicatorsWatcher = watchForm('monitoringIndicators')
  const [ecologicalAims, setEcologicalAims] = useState([])
  const preAndPostRestorationActivitiesWatcher = watchForm('preAndPostRestorationActivities')
  const [
    ecologicalMonitoringStakeholdersTypesChecked,
    setEcologicalMonitoringStakeholdersTypesChecked
  ] = useState([])

  const _loadRegistrationAnswers = useEffect(
    function loadRegistrationServerData() {
      axios
        .get(registrationInterventionFormsUrl)
        .then((registrationInterventionResponse) => {
          setBiophysicalInterventions(getBiophysicalInterventions(registrationInterventionResponse))
          const ecologicalAimsInitialVal = getEcologicalAims(registrationInterventionResponse)

          if (ecologicalAimsInitialVal.selectedValues?.length > 0) {
            const ecologicalAimsFlattened = ecologicalAimsInitialVal.selectedValues
            if (ecologicalAimsInitialVal.otherValue) {
              ecologicalAimsFlattened.push(ecologicalAimsInitialVal.otherValue)
            }
            setEcologicalAims(ecologicalAimsFlattened)
          }
          // set ecologicalMonitoringStakeholders
          const ecologicalMonitoringStakeholdersInitialVal = getEcologicalMonitoringStakeholders(
            registrationInterventionResponse
          )

          const initialEcologicalMonitoringStakeholdersTypesChecked =
            ecologicalMonitoringStakeholdersInitialVal?.map(
              (stakeholder) => stakeholder.stakeholder
            )
          setEcologicalMonitoringStakeholdersTypesChecked(
            initialEcologicalMonitoringStakeholdersTypesChecked
          )
        })
        .catch(() => {
          toast.error(language.error.apiLoad)
        })
    },
    [registrationInterventionFormsUrl]
  )

  const _loadMonitoringAnswers = useEffect(
    function loadMonitoringServerData() {
      if (isEditMode) {
        axios
          .get(monitoringFormSingularUrl)
          .then((monitoringResponse) => {
            const ecologicalMonitoringStakeholdersInitialVal =
              getEcologicalMonitoringStakeholders(monitoringResponse)

            const initialEcologicalMonitoringStakeholdersTypesChecked =
              ecologicalMonitoringStakeholdersInitialVal?.map(
                (stakeholder) => stakeholder.stakeholder
              )
            setEcologicalMonitoringStakeholdersTypesChecked(
              initialEcologicalMonitoringStakeholdersTypesChecked
            )
          })
          .catch(() => {
            toast.error(language.error.apiLoad)
          })
      }
    },
    [monitoringFormSingularUrl, isEditMode]
  )

  useInitializeMonitoringForm({
    apiUrl: monitoringFormSingularUrl,
    formType,
    isEditMode,
    questionMapping: questionMapping.ecologicalStatusAndOutcomes
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
      answers: mapDataForApi('ecologicalStatusAndOutcomes', formData)
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

  const getMonitoringFieldsIndex = (childMonitoringIndicator) =>
    monitoringIndicatorsFields.findIndex(
      (monitoringIndicator) =>
        monitoringIndicator.indicator === childMonitoringIndicator.indicator &&
        monitoringIndicator.metric === childMonitoringIndicator.metric
    )

  const handleMonitoringIndicatorsOnChange = (event, indicator, childMonitoringIndicator) => {
    const indicatorIndex = getMonitoringFieldsIndex(childMonitoringIndicator)

    if (event.target.checked) {
      monitoringIndicatorsAppend({
        mainLabel: indicator.category,
        secondaryLabel: indicator.sub_category,
        indicator: childMonitoringIndicator.indicator,
        metric: childMonitoringIndicator.metric,
        measurement: '',
        unit: '',
        comparison: '',
        measurementComparison: '',
        linkedAims: []
      })
    } else if (!event.target.checked) {
      monitoringIndicatorsRemove(indicatorIndex)
    }
  }

  const updateMonitoringOutcome = ({
    index,
    currentMeasurement,
    currentUnit,
    currentComparison,
    currentMeasurementComparison,
    currentLinkedAims
  }) => {
    const currentItem = monitoringIndicatorsFields[index]

    if (currentMeasurement) currentItem.measurement = currentMeasurement
    if (currentUnit) currentItem.unit = currentUnit
    if (currentComparison) currentItem.comparison = currentComparison
    if (currentMeasurementComparison)
      currentItem.measurementComparison = currentMeasurementComparison
    if (currentLinkedAims) currentItem.linkedAims = currentLinkedAims

    monitoringIndicatorsUpdate(index, currentItem)
  }

  const handleEcologicalMonitoringStakeholdersOnChange = (event, stakeholder) => {
    const ecologicalMonitoringStakeholdersTypesCheckedCopy = [
      ...ecologicalMonitoringStakeholdersTypesChecked
    ]

    if (event.target.checked) {
      ecologicalMonitoringStakeholdersAppend({
        stakeholder: stakeholder,
        stakeholderType: ''
      })
      ecologicalMonitoringStakeholdersTypesCheckedCopy.push(stakeholder)
    } else {
      const fieldIndex = ecologicalMonitoringStakeholdersFields.findIndex(
        (field) => field.stakeholder === stakeholder
      )
      const typeIndex = ecologicalMonitoringStakeholdersTypesCheckedCopy.findIndex(
        (type) => type === stakeholder
      )
      ecologicalMonitoringStakeholdersTypesCheckedCopy.splice(typeIndex, 1)
      ecologicalMonitoringStakeholdersRemove(fieldIndex)
    }
    setEcologicalMonitoringStakeholdersTypesChecked(
      ecologicalMonitoringStakeholdersTypesCheckedCopy
    )
  }

  const getWhichStakeholderInvolved = (stakeholder) =>
    ecologicalMonitoringStakeholdersFields.find((field) => field.stakeholder === stakeholder)

  return (
    <ContentWrapper>
      <FormPageHeader>
        <PageTitle>
          {language.pages.siteQuestionsOverview.formName.ecologicalStatusOutcomes}
        </PageTitle>
        <PageSubtitle>{site_name}</PageSubtitle>
      </FormPageHeader>
      <QuestionNav
        isFormSaving={isSubmitting}
        isFormSaveError={isSubmitError}
        onFormSave={validateInputs(handleSubmit)}
        currentSection='ecological-status-and-outcomes'
      />
      <FormValidationMessageIfErrors formErrors={errors} />

      <FormLayout>
        <FormQuestionDiv>
          <StickyFormLabel>
            {questions.dateOfEcologicalMonitoring.question}
            <RequiredIndicator />
          </StickyFormLabel>
          <Controller
            name='monitoringStartDate'
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <DatePickerUtcMui
                id='monitoring-start-date'
                label='Monitoring start date'
                field={field}
              />
            )}
          />
          <ErrorText>{errors.monitoringStartDate?.message}</ErrorText>
          <QuestionSubSection>
            <Controller
              name='monitoringEndDate'
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePickerUtcMui
                  id='monitoring-end-date'
                  label='Monitoring end date'
                  field={field}
                />
              )}
            />
            <ErrorText>{errors.monitoringEndDate?.message}</ErrorText>
          </QuestionSubSection>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.ecologicalMonitoringStakeholders.question}</StickyFormLabel>
          <List>
            {questions.ecologicalMonitoringStakeholders.options.map((stakeholder, index) => (
              <ListItem key={index}>
                <Box>
                  <Box>
                    <Checkbox
                      value={stakeholder}
                      checked={ecologicalMonitoringStakeholdersTypesChecked.includes(stakeholder)}
                      onChange={(event) =>
                        handleEcologicalMonitoringStakeholdersOnChange(event, stakeholder)
                      }></Checkbox>
                    <Typography variant='subtitle'>{stakeholder}</Typography>
                  </Box>
                  <Box>
                    {getWhichStakeholderInvolved(stakeholder) && (
                      <Box>
                        <InnerFormDiv>
                          <Controller
                            name={`ecologicalMonitoringStakeholders.${ecologicalMonitoringStakeholdersFields.findIndex(
                              (field) => field.stakeholder === stakeholder
                            )}.stakeholderType`}
                            control={control}
                            defaultValue=''
                            render={({ field }) => (
                              <TextField
                                {...field}
                                select
                                value={field.value}
                                label='select'
                                sx={{ width: '10em' }}>
                                {['Paid', 'Voluntary'].map((item, index) => (
                                  <MenuItem key={index} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </InnerFormDiv>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
          <ErrorText>{errors.ecologicalMonitoringStakeholders?.selectedValues?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.mangroveAreaIncrease.question}</StickyFormLabel>
          <Controller
            name='mangroveAreaIncrease'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveAreaIncrease.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveAreaIncrease?.message}</ErrorText>
        </FormQuestionDiv>
        {mangroveAreaIncreaseWatcher === 'Yes' || mangroveAreaIncreaseWatcher === 'No' ? (
          <FormQuestionDiv>
            <StickyFormLabel>{questions.preAndPostRestorationActivities.question}</StickyFormLabel>
            <Controller
              name='preAndPostRestorationActivities.areaPreIntervention'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField {...field} value={field.value} label='Area pre-intervention'></TextField>
              )}
            />
            <Controller
              name='preAndPostRestorationActivities.unitPre'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  value={field.value}
                  sx={{ marginTop: '1em' }}
                  label='select unit'>
                  {unitOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {preAndPostRestorationActivitiesWatcher.unitPre === 'other' ? (
              <Controller
                name='preAndPostRestorationActivities.unitPreOther'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value}
                    sx={{ marginTop: '1em' }}
                    label='specify other unit'></TextField>
                )}
              />
            ) : null}
            <Controller
              name='preAndPostRestorationActivities.areaPostIntervention'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{ marginTop: '1em' }}
                  value={field.value}
                  label='Area post-intervention'></TextField>
              )}
            />
            <Controller
              name='preAndPostRestorationActivities.unitPost'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  value={field.value}
                  sx={{ marginTop: '1em' }}
                  label='select unit'>
                  {unitOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {preAndPostRestorationActivitiesWatcher.unitPost === 'other' ? (
              <Controller
                name='preAndPostRestorationActivities.unitPostOther'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value}
                    sx={{ marginTop: '1em' }}
                    label='specify other unit'></TextField>
                )}
              />
            ) : null}
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.mangroveConditionImprovement.question}</StickyFormLabel>
          <Controller
            name='mangroveConditionImprovement'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveConditionImprovement.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveConditionImprovement?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.naturalRegenerationOnSite.question}</StickyFormLabel>
          <Controller
            name='naturalRegenerationOnSite'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.naturalRegenerationOnSite.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.naturalRegenerationOnSite?.message}</ErrorText>
        </FormQuestionDiv>
        {biophysicalInterventions.selectedValues?.length > 0 &&
        biophysicalInterventions.selectedValues.includes('Planting') ? (
          <div>
            <FormQuestionDiv>
              <StickyFormLabel>{questions.percentageSurvival.question}</StickyFormLabel>
              <Controller
                name='percentageSurvival'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} value={field.value} label='Percentage'></TextField>
                )}
              />
              <ErrorText>{errors.percentageSurvival?.message}</ErrorText>
            </FormQuestionDiv>
            <FormQuestionDiv>
              <CheckboxGroupWithLabelAndController
                fieldName='causeOfLowSurvival'
                control={control}
                options={questions.causeOfLowSurvival.options}
                question={questions.causeOfLowSurvival.question}
                shouldAddOtherOptionWithClarification={true}
              />
              <ErrorText>{errors.causeOfLowSurvival?.selectedValues?.message}</ErrorText>
            </FormQuestionDiv>
          </div>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.mangroveEcologicalOutcomes.question}</StickyFormLabel>
          {monitoringIndicators.map((indicator, indicatorIndex) => (
            <Box key={indicatorIndex}>
              <NestedLabel1>{`${indicator.category}: ${indicator.sub_category}`}</NestedLabel1>
              {indicator.indicators.map((childMonitoringIndicator, childIndex) => (
                <ListItem key={childIndex}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={childMonitoringIndicator.indicator}
                        checked={getMonitoringFieldsIndex(childMonitoringIndicator) !== -1}
                        onChange={(event) =>
                          handleMonitoringIndicatorsOnChange(
                            event,
                            indicator,
                            childMonitoringIndicator
                          )
                        }></Checkbox>
                    }
                    label={`${childMonitoringIndicator.indicator}: ${childMonitoringIndicator.metric}`}
                  />
                </ListItem>
              ))}
            </Box>
          ))}
        </FormQuestionDiv>
        {monitoringIndicatorsWatcher?.length > 0 ? (
          <FormQuestionDiv>
            <StickyFormLabel>
              {questions.mangroveEcologicalOutcomesAdditionalData.question}
            </StickyFormLabel>
            {monitoringIndicatorsFields?.length > 0
              ? monitoringIndicatorsFields?.map((item, index) => (
                  <EcologicalOutcomesRow
                    key={index}
                    index={index}
                    mainLabel={item.mainLabel}
                    secondaryLabel={item.secondaryLabel}
                    indicator={item.indicator}
                    metric={item.metric}
                    measurement={item.measurement}
                    unit={item.unit}
                    comparison={item.comparison}
                    measurementComparison={item.measurementComparison}
                    linkedAims={item.linkedAims}
                    selectedAims={ecologicalAims}
                    updateItem={updateMonitoringOutcome}></EcologicalOutcomesRow>
                ))
              : null}
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          <StickyFormLabel>{questions.achievementOfEcologicalAims.question}</StickyFormLabel>
          <Controller
            name='achievementOfEcologicalAims'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.achievementOfEcologicalAims.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.achievementOfEcologicalAims?.message}</ErrorText>
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

export default EcologicalStatusAndOutcomesForm
