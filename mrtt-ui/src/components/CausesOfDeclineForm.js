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
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import {
  FormQuestionDiv,
  MainFormDiv,
  NestedFormSectionDiv,
  SectionFormTitle
} from '../styles/forms'
import { causesOfDecline } from '../data/questions'
import { causesOfDeclineOptions } from '../data/causesOfDeclineOptions'

function CausesOfDeclineForm() {
  // form validation rules
  const validationSchema = Yup.object().shape({
    lossKnown: Yup.boolean()
  })
  const formOptions = { resolver: yupResolver(validationSchema) }

  // get functions to build form with useForm() hook
  const { control } = useForm(formOptions)

  const handleCausesOfDeclineOnChange = ({ event, secondaryChild, nesting }) => {
    return event, secondaryChild, nesting
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
        {causesOfDeclineOptions.map((option, index) => {
          return (
            <Box key={index} sx={{ marginTop: '0.75em' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                {option.label}
              </Typography>
              {typeof option.children[0] === 'string'
                ? option.children.map((optionChild, indexChild) => (
                    <ListItem key={indexChild}>
                      <NestedFormSectionDiv>
                        <Checkbox
                          value={optionChild}
                          onChange={(event) =>
                            handleCausesOfDeclineOnChange({ event, optionChild, nesting: false })
                          }></Checkbox>
                        <Typography variant='subtitle2'>{optionChild}</Typography>
                      </NestedFormSectionDiv>
                    </ListItem>
                  ))
                : option.children.map((optionChild, indexChild) => (
                    <Box key={indexChild} variant='subtitle2' sx={{ marginLeft: '0.75em' }}>
                      <Typography
                        sx={{ marginTop: '0.75em', fontWeight: 'bold' }}
                        variant='subtitle2'>
                        {optionChild.secondaryLabel}
                      </Typography>
                      {optionChild.secondaryChildren.map((secondaryChild, secondaryChildIndex) => {
                        return (
                          <ListItem key={secondaryChildIndex}>
                            <NestedFormSectionDiv>
                              <Checkbox
                                value={secondaryChild}
                                onChange={(event) =>
                                  handleCausesOfDeclineOnChange({
                                    event,
                                    secondaryChild,
                                    nesting: true
                                  })
                                }></Checkbox>
                              <Typography variant='subtitle2'>{secondaryChild} </Typography>
                            </NestedFormSectionDiv>
                          </ListItem>
                        )
                      })}
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
