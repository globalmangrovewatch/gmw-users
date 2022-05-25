import React from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormLabel,
  ListItem,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import {
  FormQuestionDiv,
  MainFormDiv,
  NestedFormSectionDiv,
  SectionFormTitle,
  SubTitle,
  SubTitle2
} from '../styles/forms'
import { causesOfDecline } from '../data/questions'
import { causesOfDeclineOptions } from '../data/causesOfDeclineOptions'

function CausesOfDeclineForm() {
  const validationSchema = yup.object().shape({
    lossKnown: yup.boolean(),
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
  const { control } = useForm(formOptions)
  // const { errors } = formState
  const {
    fields: causesOfDeclineFields,
    append: causesOfDeclineAppend,
    remove: causesOfDeclineRemove
  } = useFieldArray({ name: 'causesOfDecline', control })

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
      }
      // if subCause does exist within main cause
      else {
        currentSubCause.subCauseAnswers.push({
          subCauseAnswer: secondaryChildOption,
          levelOfDegredation: ''
        })
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
      }
    }
    // case: unchecked, subCause exists
    else if (!event.target.checked && subCauseLabel) {
      // if only one answer exists within subCauseAnswers
      if (currentSubCause.subCauseAnswers.length === 1) {
        currentMainCause.subCauses.splice(subCauseIndex, 1)
      }
      // if more than one answer exists with subCauseAnswers
      else {
        const secondaryChildOptionIndex = currentSubCause.subCauseAnswers.findIndex(
          (option) => option.subCauseAnswer === secondaryChildOption
        )
        currentSubCause.subCauseAnswers.splice(secondaryChildOptionIndex, 1)
      }
      // remove main cause if subcauses array is empty
      if (currentMainCause.subCauses.length === 0) {
        causesOfDeclineRemove(mainCauseIndex)
      }
    }
    console.log('fields>>>>', causesOfDeclineFields)
  }

  return (
    <MainFormDiv>
      <SectionFormTitle>Causes of Decline</SectionFormTitle>
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
              <FormControlLabel value={true} control={<Radio />} label='Yes' />
              <FormControlLabel value={false} control={<Radio />} label='No' />
            </RadioGroup>
          )}
        />
      </FormQuestionDiv>
      <FormQuestionDiv>
        <FormLabel>{causesOfDecline.causesOfDecline.question}</FormLabel>
        {causesOfDeclineOptions.map((mainCause, mainCauseIndex) => {
          return (
            <Box key={mainCauseIndex} sx={{ marginTop: '0.75em', marginBottom: '1.5em' }}>
              <SubTitle variant='subtitle1'>{mainCause.label}</SubTitle>
              {typeof mainCause.children[0] === 'string'
                ? mainCause.children.map((childOption, childIndex) => (
                    <ListItem key={childIndex}>
                      <NestedFormSectionDiv>
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
                      </NestedFormSectionDiv>
                    </ListItem>
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
                              <NestedFormSectionDiv>
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
                                <Typography variant='subtitle2'>{secondaryChildOption} </Typography>
                              </NestedFormSectionDiv>
                            </ListItem>
                          )
                        }
                      )}
                    </Box>
                  ))}
            </Box>
          )
        })}
      </FormQuestionDiv>
      {/* <FormQuestionDiv>
        {isError && (
          <Typography variant='subtitle' sx={{ color: 'red' }}>
            Submit failed, please try again
          </Typography>
        )}
        <Button variant='contained' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </FormQuestionDiv> */}
    </MainFormDiv>
  )
}

export default CausesOfDeclineForm
