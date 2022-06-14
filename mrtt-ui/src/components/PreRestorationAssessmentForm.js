import { useState } from 'react'
import axios from 'axios'
import {
  useForm,
  // useFieldArray,
  Controller
} from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormLabel, MenuItem, TextField } from '@mui/material'

import {
  Form,
  FormQuestionDiv,
  MainFormDiv,
  //   NestedFormSectionDiv,
  SectionFormTitle
  //   SubTitle,
  //   SubTitle2
} from '../styles/forms'
// import { questionMapping } from '../data/questionMapping'
import { preRestorationAssessment as questions } from '../data/questions'
import { mapDataForApi } from '../library/mapDataForApi'
import { ButtonSubmit } from '../styles/buttons'
import { ErrorText } from '../styles/typography'

function PreRestorationAssessmentForm() {
  const validationSchema = yup.object().shape({
    mangrovesPreviouslyOccured: yup.string().required('This field is required'),
    mangroveRestorationAttempted: yup.string().required('This field is required'),
    lastRestorationAttemptYear: yup.mixed().when(' mangroveRestorationAttempted', {
      is: (val) => val && val === 'Yes',
      then: yup
        .number()
        .typeError('You must specify a year')
        .min(1900, 'Year must be higher than 1900')
        .max(new Date().getFullYear(), 'Year must less than or equal to the current year')
    })
  })
  const reactHookFormInstance = useForm({
    defaultValues: {},
    resolver: yupResolver(validationSchema)
  })
  const {
    handleSubmit: validateInputs,
    formState: { errors },
    control
  } = reactHookFormInstance

  const [isSubmitting, setisSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (data) => {
    setisSubmitting(true)
    setIsError(false)

    console.log('data: ', data)
    const url = `${process.env.REACT_APP_API_URL}/sites/1/registration_answers`

    if (!data) return

    axios
      .put(url, mapDataForApi('siteBackground', data))
      .then(() => {
        setisSubmitting(false)
      })
      .catch(() => {
        setIsError(true)
        setisSubmitting(false)
      })
  }

  return (
    <MainFormDiv>
      <SectionFormTitle>Pre-restoration Assessment</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <FormQuestionDiv>
          <FormLabel>{questions.mangrovesPreviouslyOccured.question}</FormLabel>
          <Controller
            name='mangrovesPreviouslyOccured'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangrovesPreviouslyOccured.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangrovesPreviouslyOccured?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.mangroveRestorationAttempted.question}</FormLabel>
          <Controller
            name='mangroveRestorationAttempted'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} select value={field.value} label='select'>
                {questions.mangroveRestorationAttempted.options.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <ErrorText>{errors.mangroveRestorationAttempted?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          <FormLabel>{questions.lastRestorationAttemptYear.question}</FormLabel>
          <Controller
            name='lastRestorationAttemptYear'
            control={control}
            defaultValue={''}
            render={({ field }) => (
              <TextField {...field} value={field.value} label='enter year'></TextField>
            )}
          />
          <ErrorText>{errors.lastRestorationAttemptYear?.message}</ErrorText>
        </FormQuestionDiv>
        <FormQuestionDiv>
          {isError && <ErrorText>Submit failed, please try again</ErrorText>}
          <ButtonSubmit isSubmitting={isSubmitting}></ButtonSubmit>
        </FormQuestionDiv>
      </Form>
    </MainFormDiv>
  )
}

export default PreRestorationAssessmentForm
