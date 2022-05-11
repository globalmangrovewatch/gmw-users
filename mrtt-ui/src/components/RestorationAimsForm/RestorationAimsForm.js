import { FormLabel } from '@mui/material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormQuestionDiv, MainFormDiv, SectionFormTitle } from '../../styles/forms'
import ButtonSubmit from '../ButtonSubmit'
import CheckboxGroupMangroveWithLabel from '../CheckboxGroupMangroveWithLabel'
import restorationAimsQuestionsAndAnswers from './restorationAimsQuestionsAndAnswers'

const RestorationAimsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reactHookFormInstance = useForm()

  const { handleSubmit: validateInputs } = reactHookFormInstance

  const handleSubmit = () => {
    setIsSubmitting(true)
    // hit api here
    setIsSubmitting(false)
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
      <form onSubmit={validateInputs(handleSubmit)}>
        <CheckboxGroupMangroveWithLabel
          fieldName='ecologicalAims'
          reactHookFormInstance={reactHookFormInstance}
          options={ecologicalAimsOptions}
          question={restorationAimsQuestionsAndAnswers[1].question}
        />
        <CheckboxGroupMangroveWithLabel
          fieldName='socioEconomicAims'
          reactHookFormInstance={reactHookFormInstance}
          options={socioEconomicAimsOptions}
          question={restorationAimsQuestionsAndAnswers[2].question}
        />
        <CheckboxGroupMangroveWithLabel
          fieldName='otherAims'
          reactHookFormInstance={reactHookFormInstance}
          options={otherAimsOptions}
          question={restorationAimsQuestionsAndAnswers[3].question}
        />
        <FormQuestionDiv>
          <FormLabel>{restorationAimsQuestionsAndAnswers[4].question}</FormLabel>
        </FormQuestionDiv>
        <div>Question 3.4 is complicated and will be built in a later ticket (#41)</div>
        <ButtonSubmit isSubmitting={isSubmitting} />
      </form>
    </MainFormDiv>
  )
}

export default RestorationAimsForm
