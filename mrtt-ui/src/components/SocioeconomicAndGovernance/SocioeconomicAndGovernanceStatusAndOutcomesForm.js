import { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import {
  Box,
  Checkbox,
  FormControlLabel,
  ListItem,
  MenuItem,
  Stack,
  TextField
} from '@mui/material'

import {
  Form,
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
import useInitializeQuestionMappedForm from '../../library/useInitializeQuestionMappedForm'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import { multiselectWithOtherValidationNoMinimum } from '../../validation/multiSelectWithOther'
import { socioIndicators } from '../../data/socio_indicator'
import { findDataItem } from '../../library/findDataItem'
import SocioeconomicOutcomesRow from './socioeconomicOutcomesRow'

const getSocioeconomicOutcomes = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '9.4') ?? []

const getSocioeconomicAims = (registrationAnswersFromServer) =>
  findDataItem(registrationAnswersFromServer, '3.2') ?? []

const SocioeconomicAndGovernanceStatusAndOutcomesForm = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    dateOfOutcomesAssessment: yup.string().nullable(),
    changeInGovernance: yup.string(),
    currentGovenance: multiselectWithOtherValidationNoMinimum,
    changeInTenureArrangement: yup.string(),
    currentLandOwnership: multiselectWithOtherValidationNoMinimum,
    rightsToLandInLaw: yup.string(),
    socioeconomicOutcomes: yup
      .array()
      .of(
        yup.object().shape({
          mainLabel: yup.string(),
          secondaryLabel: yup.string(),
          child: yup.string(),
          type: yup.string(),
          trend: yup.string(),
          linkedAim: yup.string(),
          measurement: yup.string(),
          unit: yup.string(),
          comparison: yup.string(),
          value: yup.mixed()
        })
      )
      .default([]),
    achievementOfSocioeconomicAims: yup.string()
  })
  const reactHookFormInstance = useForm({
    defaultValues: {
      currentGovenance: { selectedValues: [] },
      currentLandOwnership: { selectedValues: [] }
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
    fields: socioeconomicOutcomesFields,
    append: socioeconomicOutcomesAppend,
    remove: socioeconomicOutcomesRemove,
    replace: socioeconomicOutcomesReplace,
    update: socioeconomicOutcomesUpdate
  } = useFieldArray({ name: 'socioeconomicOutcomes', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const changeInGovernanceWatcher = watchForm('changeInGovernance')
  const changeInTenureArrangementWatcher = watchForm('changeInTenureArrangement')
  const socioeconomicOutcomesWatcher = watchForm('socioeconomicOutcomes')
  const [socioeconomicAims, setSocioeconomicAims] = useState([])
  const loadServerData = useCallback(
    (serverResponse) => {
      const socioeconomicInitialVal = getSocioeconomicOutcomes(serverResponse)
      if (socioeconomicInitialVal.length > 0) {
        socioeconomicOutcomesReplace(socioeconomicInitialVal)
      }
      const socioeconomicAimsInitialVal = getSocioeconomicAims(serverResponse)
      if (socioeconomicAimsInitialVal.selectedValues.length > 0) {
        const socioeconomicAimsFlattened = socioeconomicAimsInitialVal.selectedValues
        if (socioeconomicAimsInitialVal.otherValue) {
          socioeconomicAimsFlattened.push(socioeconomicAimsInitialVal.otherValue)
        }
        setSocioeconomicAims(socioeconomicAimsFlattened)
      }
    },
    [socioeconomicOutcomesReplace]
  )

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.socioeconomicAndGovernanceStatusAndOutcomes,
    resetForm,
    setIsLoading,
    successCallback: loadServerData
  })

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)

    axios
      .patch(apiAnswersUrl, mapDataForApi('socioeconomicAndGovernanceStatusAndOutcomes', formData))
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
        linkedAim: '',
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
    currentLinkedAim,
    currentMeasurement,
    currentUnit,
    currentComparison,
    currentValue
  }) => {
    const currentItem = socioeconomicOutcomesFields[index]

    if (currentType) currentItem.type = currentType
    if (currentTrend) currentItem.trend = currentTrend
    if (currentLinkedAim) currentItem.linkedAim = currentLinkedAim
    if (currentMeasurement) currentItem.measurement = currentMeasurement
    if (currentUnit) currentItem.unit = currentUnit
    if (currentComparison) currentItem.comparison = currentComparison
    if (currentValue) currentItem.value = currentValue

    socioeconomicOutcomesUpdate(index, currentItem)
  }

  return isLoading ? (
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

      <Form>
        <FormQuestionDiv>
          <StickyFormLabel>{questions.dateOfOutcomesAssessment.question}</StickyFormLabel>
          <Controller
            name='dateOfOutcomesAssessment'
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns} {...field} ref={null}>
                <Stack spacing={3}>
                  <MobileDatePicker
                    id='date-of-outcomes-assessment'
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
              reactHookFormInstance={reactHookFormInstance}
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
                reactHookFormInstance={reactHookFormInstance}
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
                    linkedAim={item.linkedAim}
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
      </Form>
    </ContentWrapper>
  )
}

export default SocioeconomicAndGovernanceStatusAndOutcomesForm
