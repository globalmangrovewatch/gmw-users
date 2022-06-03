import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  Form,
  FormQuestionDiv,
  MainFormDiv,
  SectionFormTitle,
  SubTitle,
  SubTitle2
} from '../styles/forms'
import { ButtonSubmit } from '../styles/buttons'
import { causesOfDecline } from '../data/questions'
import { causesOfDeclineOptions } from '../data/causesOfDeclineOptions'
import { ErrorText } from '../styles/typography'
import { mapDataForApi } from '../library/mapDataForApi'
import { questionMapping } from '../data/questionMapping'
import formatApiAnswersForForm from '../library/formatApiAnswersForForm'
import language from '../language'
import LoadingIndicator from './LoadingIndicator'

function CausesOfDeclineForm() {
  const validationSchema = yup.object().shape({
    lossKnown: yup.string(),
    causesOfDecline: yup
      .array()
      .of(
        yup.object().shape({
          mainCauseLabel: yup.string(),
          mainCauseAnswers: yup.array().of(
            yup.object().shape({
              mainCauseAnswer: yup.string(),
              levelOfDegredation: yup.string().required()
            })
          ),
          subCauses: yup.array().of(
            yup.object().shape({
              subCauseLabel: yup.string(),
              subCauseAnswers: yup.array().of(
                yup.object().shape({
                  subCauseAnswer: yup.string(),
                  levelOfDegredation: yup.string().required()
                })
              )
            })
          )
        })
      )
      .min(1)
      .required('Select at least one cause of decline')
      .default([])
  })

  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { control, formState, watch, handleSubmit, reset: resetForm } = useForm(formOptions)
  const { errors } = formState
  const {
    fields: causesOfDeclineFields,
    append: causesOfDeclineAppend,
    remove: causesOfDeclineRemove,
    update: causesOfDeclineUpdate
  } = useFieldArray({ name: 'causesOfDecline', control })
  const lossKnownWatcher = watch('lossKnown')

  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { siteId } = useParams()
  const apiAnswersUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_answers`

  const _loadSiteData = useEffect(() => {
    if (apiAnswersUrl && resetForm) {
      setIsLoading(true)
      axios
        .get(apiAnswersUrl)
        .then(({ data }) => {
          setIsLoading(false)
          const initialValuesForForm = formatApiAnswersForForm({
            apiAnswers: data,
            questionMapping: questionMapping.causesOfDecline
          })

          resetForm(initialValuesForForm)
        })
        .catch(() => {
          toast.error(language.error.apiLoad)
        })
    }
  }, [apiAnswersUrl, resetForm])

  // big function with many different cases for Q4.2 due to the nesting involved in this question type
  const handleCausesOfDeclineOnChange = ({
    event,
    mainCauseLabel,
    subCauseLabel,
    childOption,
    secondaryChildOption
  }) => {
    const mainCauseIndex = causesOfDeclineFields.findIndex(
      (cause) => cause.mainCauseLabel === mainCauseLabel
    )
    const currentMainCause = causesOfDeclineFields[mainCauseIndex]
    const subCauseIndex = currentMainCause?.subCauses?.findIndex(
      (subCause) => subCause.subCauseLabel === subCauseLabel
    )
    const currentSubCause = currentMainCause?.subCauses?.[subCauseIndex]

    //  case: checked, no subCause, and mainCause does not exist
    if (event.target.checked && !subCauseLabel && mainCauseIndex === -1) {
      causesOfDeclineAppend({
        mainCauseLabel,
        mainCauseAnswers: [{ mainCauseAnswer: childOption, levelOfDegredation: '' }]
      })
    }
    // case: checked, no subCause, mainCause exists
    else if (event.target.checked && !subCauseLabel && mainCauseIndex > -1) {
      currentMainCause.mainCauseAnswers.push({
        mainCauseAnswer: childOption,
        levelOfDegredation: ''
      })

      causesOfDeclineUpdate(currentMainCause)
    }
    // case: checked, subCause, mainCause does not exist
    else if (event.target.checked && subCauseLabel && mainCauseIndex === -1) {
      causesOfDeclineAppend({
        mainCauseLabel,
        subCauses: [
          {
            subCauseLabel,
            subCauseAnswers: [{ subCauseAnswer: secondaryChildOption, levelOfDegredation: '' }]
          }
        ]
      })
    }
    // case: checked, subCause, mainCause does exist
    else if (event.target.checked && subCauseLabel && mainCauseIndex > -1) {
      // if subCause does not exist within main cause
      if (subCauseIndex === -1) {
        currentMainCause.subCauses.push({
          subCauseLabel,
          subCauseAnswers: [{ subCauseAnswer: secondaryChildOption, levelOfDegredation: '' }]
        })
        causesOfDeclineUpdate(currentMainCause)
      }
      // if subCause does exist within main cause
      else {
        currentSubCause.subCauseAnswers.push({
          subCauseAnswer: secondaryChildOption,
          levelOfDegredation: ''
        })
        causesOfDeclineUpdate(currentMainCause)
      }
    }
    // case: unchecked, no subCause
    else if (!event.target.checked && !subCauseLabel) {
      // if only one answer exists within mainCauseAnswers
      if (currentMainCause.mainCauseAnswers.length === 1) {
        causesOfDeclineRemove(mainCauseIndex)
      }
      // if more than one answer exists within mainCauseAnwers
      else {
        const childOptionIndex = currentMainCause.mainCauseAnswers.findIndex(
          (option) => option.mainCauseAnswer === childOption
        )
        currentMainCause.mainCauseAnswers.splice(childOptionIndex, 1)
        causesOfDeclineUpdate(currentMainCause)
      }
    }
    // case: unchecked, subCause exists
    else if (!event.target.checked && subCauseLabel) {
      // if only one answer exists within subCauseAnswers
      if (currentSubCause.subCauseAnswers.length === 1) {
        currentMainCause.subCauses.splice(subCauseIndex, 1)
        causesOfDeclineUpdate(currentMainCause)
      }
      // if more than one answer exists with subCauseAnswers
      else {
        const secondaryChildOptionIndex = currentSubCause.subCauseAnswers.findIndex(
          (option) => option.subCauseAnswer === secondaryChildOption
        )
        currentSubCause.subCauseAnswers.splice(secondaryChildOptionIndex, 1)
        causesOfDeclineUpdate(currentMainCause)
      }
      // remove main cause if subcauses array is empty
      if (currentMainCause.subCauses.length === 0) {
        causesOfDeclineRemove(mainCauseIndex)
      }
    }
  }

  const onSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)

    if (!data) return
    'data', data

    axios
      .patch(apiAnswersUrl, mapDataForApi('causesOfDecline', data))
      .then(() => {
        setisSubmitting(false)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
        toast.error(language.error.apiLoad)
      })
  }

  return isLoading ? (
    <LoadingIndicator />
  ) : (
    <MainFormDiv>
      <SectionFormTitle>Causes of Decline</SectionFormTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormQuestionDiv>
          <FormLabel>{causesOfDecline.lossKnown.question}</FormLabel>
          <Controller
            name='lossKnown'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                {...field}
                aria-labelledby='demo-radio-buttons-group-label'
                name='radio-buttons-group'>
                {/* Mui converts values to strings, even for booleans */}
                <FormControlLabel value={'true'} control={<Radio />} label='Yes' />
                <FormControlLabel value={'false'} control={<Radio />} label='No' />
              </RadioGroup>
            )}
          />
        </FormQuestionDiv>
        {lossKnownWatcher === 'true' ? (
          <FormQuestionDiv>
            <FormLabel>{causesOfDecline.causesOfDecline.question}</FormLabel>
            {causesOfDeclineOptions.map((mainCause, mainCauseIndex) => {
              return (
                <Box key={mainCauseIndex} sx={{ marginTop: '0.75em', marginBottom: '1.5em' }}>
                  <SubTitle variant='subtitle1'>{mainCause.label}</SubTitle>
                  {typeof mainCause.children[0] === 'string'
                    ? mainCause.children.map((childOption, childIndex) => (
                        <Box key={childIndex}>
                          <Box>
                            <ListItem>
                              <Checkbox
                                value={childOption}
                                onChange={(event) =>
                                  handleCausesOfDeclineOnChange({
                                    event,
                                    mainCauseLabel: mainCause.label,
                                    childOption
                                  })
                                }></Checkbox>
                              <Typography variant='subtitle2'>{childOption}</Typography>
                            </ListItem>
                          </Box>
                        </Box>
                      ))
                    : mainCause.children.map((subCause, subCauseIndex) => (
                        <Box
                          key={subCauseIndex}
                          variant='subtitle2'
                          sx={{ marginLeft: '1em', marginTop: '0.75em' }}>
                          <SubTitle2 variant='subtitle2'>{subCause.secondaryLabel}</SubTitle2>
                          {subCause.secondaryChildren.map(
                            (secondaryChildOption, secondaryChildIndex) => {
                              return (
                                <ListItem key={secondaryChildIndex}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        value={secondaryChildOption}
                                        onChange={(event) =>
                                          handleCausesOfDeclineOnChange({
                                            event,
                                            mainCauseLabel: mainCause.label,
                                            subCauseLabel: subCause.secondaryLabel,
                                            secondaryChildOption
                                          })
                                        }></Checkbox>
                                    }
                                    label={<>{secondaryChildOption} </>}
                                  />
                                </ListItem>
                              )
                            }
                          )}
                        </Box>
                      ))}
                </Box>
              )
            })}
            <ErrorText>{errors.causesOfDecline?.message}</ErrorText>
          </FormQuestionDiv>
        ) : null}
        {causesOfDeclineFields.length ? (
          <FormQuestionDiv>
            <FormLabel>{causesOfDecline.levelsOfDegredation.question}</FormLabel>
            {causesOfDeclineFields.map((mainCause, mainCauseIndex) => (
              <Box key={mainCauseIndex}>
                <SubTitle sx={{ marginBottom: '0.5em', marginTop: '1em' }}>
                  {mainCause.mainCauseLabel}
                </SubTitle>
                {mainCause.mainCauseAnswers?.map((answer, answerIndex) => {
                  return (
                    <Box key={answerIndex}>
                      <Typography sx={{ marginLeft: '0.75em' }} variant='subtitle2'>
                        {answer.mainCauseAnswer}
                      </Typography>
                      <Controller
                        name={`causesOfDecline.${mainCauseIndex}.mainCauseAnswers.${answerIndex}.levelOfDegredation`}
                        control={control}
                        defaultValue=''
                        required
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            required
                            value={field.value}
                            label='Magnitude of impact *'
                            sx={{
                              width: '13em',
                              marginLeft: '0.5em',
                              marginTop: '0.5em',
                              marginBottom: '1.5em'
                            }}>
                            {causesOfDecline.levelsOfDegredation.options.map((item, index) => (
                              <MenuItem key={index} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </TextField>
                        )}
                      />
                    </Box>
                  )
                })}
                {mainCause.subCauses?.map((subCause, subCauseIndex) => {
                  return (
                    <Box key={subCauseIndex}>
                      <SubTitle2 sx={{ marginLeft: '0.75em' }} variant='subtitle2'>
                        {subCause.subCauseLabel}
                      </SubTitle2>
                      {subCause.subCauseAnswers?.map((subCauseAnswer, subCauseAnswerIndex) => {
                        return (
                          <Box key={subCauseAnswerIndex}>
                            <Typography sx={{ marginLeft: '0.75em' }} variant='subtitle2'>
                              {subCauseAnswer.subCauseAnswer}
                            </Typography>
                            <Controller
                              name={`causesOfDecline.${mainCauseIndex}.subCauses.${subCauseIndex}.subCauseAnswers.${subCauseAnswerIndex}.levelOfDegredation`}
                              control={control}
                              defaultValue=''
                              required
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  select
                                  value={field.value}
                                  label='Magnitude of impact *'
                                  sx={{
                                    width: '13em',
                                    marginLeft: '0.5em',
                                    marginTop: '0.5em',
                                    marginBottom: '1em'
                                  }}>
                                  {causesOfDecline.levelsOfDegredation.options.map(
                                    (item, index) => (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    )
                                  )}
                                </TextField>
                              )}
                            />
                          </Box>
                        )
                      })}
                    </Box>
                  )
                })}
              </Box>
            ))}
          </FormQuestionDiv>
        ) : null}
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </Form>
    </MainFormDiv>
  )
}

export default CausesOfDeclineForm
