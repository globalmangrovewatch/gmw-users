import { useState } from 'react'
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

const SocioeconomicAndGovernanceStatusAndOutcomesForm = () => {
  const { site_name } = useSiteInfo()
  const validationSchema = yup.object({
    dateOfOutcomesAssessment: yup.string().nullable(),
    changeInGovernance: yup.string(),
    currentGovenance: multiselectWithOtherValidationNoMinimum,
    changeInTenureArrangement: yup.string(),
    currentLandOwnership: multiselectWithOtherValidationNoMinimum,
    rightsToLandInLaw: yup.string(),
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
    fields: socioEconomicFields,
    append: socioEconomicAppend
    // remove: socioEconomicRemove,
    // update: socioEconomicUpdate
  } = useFieldArray({ name: 'socioEconomic', control })

  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const changeInGovernanceWatcher = watchForm('changeInGovernance')
  const changeInTenureArrangementWatcher = watchForm('changeInTenureArrangement')

  useInitializeQuestionMappedForm({
    apiUrl: apiAnswersUrl,
    questionMapping: questionMapping.socioeconomicAndGovernanceStatusAndOutcomes,
    resetForm,
    setIsLoading
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

  const findSocioEconomicFieldsIndex = (indicator) =>
    socioEconomicFields.findIndex((socioIndicator) => socioIndicator.child === indicator)

  const handleSocioIndicatorsOnChange = ({ event, indicator, childSocioIndicator }) => {
    const indicatorIndex = findSocioEconomicFieldsIndex(childSocioIndicator)

    // case: checked, socioChildIndicator does not exist in fields array
    if (event.target.checked && indicatorIndex === -1) {
      socioEconomicAppend({
        mainLabel: indicator.label,
        secondaryLabel: indicator.secondaryLabel,
        child: childSocioIndicator
      })
    }
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
                        checked={findSocioEconomicFieldsIndex(childSocioIndicator) !== -1}
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
