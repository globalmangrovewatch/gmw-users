import { FormLabel } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'

import { ErrorText } from '../../styles/typography'
import { Form, FormQuestionDiv, MainFormDiv, SectionFormTitle } from '../../styles/forms'
import ButtonSubmit from '../ButtonSubmit'
import CheckboxGroupMangroveWithLabel from '../CheckboxGroupMangroveWithLabel'
import language from '../../language'
import restorationAimsQuestionsAndAnswers from './restorationAimsQuestionsAndAnswers'

const formatFormDataForApi = (formData) =>
  Object.entries(formData).map((formField) => {
    const formAnswers = formField[1].map((formAnswer) => ({ choice: formAnswer }))

    return {
      question_id: `Q3.${formField[0]}`,
      answer_value: formAnswers
    }
  })

const submitUrl = `${process.env.REACT_APP_API_URL}sites/1/registration_answers`

const RestorationAimsForm = () => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reactHookFormInstance = useForm()
  const { handleSubmit: validateInputs } = reactHookFormInstance

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    axios
      .patch(submitUrl, formatFormDataForApi(formData))
      .then(() => {
        setIsSubmitting(false)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
      })
  }
  const generateOptionsObjectFromAnswers = (answers) =>
    answers.map((answer) => ({
      label: answer,
      value: answer
    }))
  const ecologicalAimsOptions = generateOptionsObjectFromAnswers(
    restorationAimsQuestionsAndAnswers[1].answers
  )
  const socioEconomicAimsOptions = generateOptionsObjectFromAnswers(
    restorationAimsQuestionsAndAnswers[2].answers
  )
  const otherAimsOptions = generateOptionsObjectFromAnswers(
    restorationAimsQuestionsAndAnswers[3].answers
  )
  return (
    <MainFormDiv>
      <SectionFormTitle>Restoration Aims</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <CheckboxGroupMangroveWithLabel
          fieldName='1'
          reactHookFormInstance={reactHookFormInstance}
          options={ecologicalAimsOptions}
          question={restorationAimsQuestionsAndAnswers[1].question}
        />
        <CheckboxGroupMangroveWithLabel
          fieldName='2'
          reactHookFormInstance={reactHookFormInstance}
          options={socioEconomicAimsOptions}
          question={restorationAimsQuestionsAndAnswers[2].question}
        />
        <CheckboxGroupMangroveWithLabel
          fieldName='3'
          reactHookFormInstance={reactHookFormInstance}
          options={otherAimsOptions}
          question={restorationAimsQuestionsAndAnswers[3].question}
        />
        <FormQuestionDiv>
          <FormLabel>{restorationAimsQuestionsAndAnswers[4].question}</FormLabel>
        </FormQuestionDiv>
        <div>Question 3.4 is complicated and will be built in a later ticket (#41)</div>
        {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </Form>
    </MainFormDiv>
  )
}

export default RestorationAimsForm
