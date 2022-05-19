import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'

import { ErrorText } from '../../styles/typography'
import { Form, MainFormDiv, SectionFormTitle } from '../../styles/forms'
import { mapDataForApi } from '../../library/mapDataForApi'
import { restorationAims as questions } from '../../data/questions'
import ButtonSubmit from '../ButtonSubmit'
import CheckboxGroupWithLabelAndController from '../CheckboxGroupWithLabelAndController'
import language from '../../language'

const submitUrl = `${process.env.REACT_APP_API_URL}/sites/1/registration_answers`

const otherIsCheckedButInputIsEmptyValidation = (schema) =>
  schema.test({
    name: 'isOtherCheckedAndEmpty',
    message: language.restorationAimsForm.validation.clairfyOther,
    test: (value, context) => {
      const {
        parent: { otherValue }
      } = context
      return otherValue !== undefined && otherValue !== ''
    }
  })

const aimsValidation = yup.object({
  selectedValues: yup
    .array()
    .of(yup.string())
    .when('isOtherChecked', {
      is: false || undefined,
      then: (schema) => schema.min(1, language.restorationAimsForm.validation.selectAtleastOneAim),
      otherwise: otherIsCheckedButInputIsEmptyValidation
    }),
  otherValue: yup.string(),
  isOtherChecked: yup.bool()
})

const RestorationAimsForm = () => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const validationSchema = yup.object({
    ecologicalAims: aimsValidation,
    socioEconomicAims: aimsValidation,
    otherAims: aimsValidation
  })

  const reactHookFormInstance = useForm({
    defaultValues: {
      ecologicalAims: { selectedValues: [], otherValue: undefined },
      socioEconomicAims: { selectedValues: [], otherValue: undefined },
      otherAims: { selectedValues: [], otherValue: undefined }
    },
    resolver: yupResolver(validationSchema)
  })
  const {
    handleSubmit: validateInputs,
    formState: { errors }
  } = reactHookFormInstance

  const handleSubmit = (formData) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    axios
      .patch(submitUrl, mapDataForApi('restorationAims', formData))
      .then(() => {
        setIsSubmitting(false)
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
      })
  }

  return (
    <MainFormDiv>
      <SectionFormTitle>Restoration Aims</SectionFormTitle>
      <Form onSubmit={validateInputs(handleSubmit)}>
        <CheckboxGroupWithLabelAndController
          fieldName='ecologicalAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.ecologicalAims.options}
          question={questions.ecologicalAims.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.ecologicalAims?.selectedValues?.message}</ErrorText>
        <CheckboxGroupWithLabelAndController
          fieldName='socioEconomicAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.socioEconomicAims.options}
          question={questions.socioEconomicAims.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.socioEconomicAims?.selectedValues?.message}</ErrorText>
        <CheckboxGroupWithLabelAndController
          fieldName='otherAims'
          reactHookFormInstance={reactHookFormInstance}
          options={questions.otherAims.options}
          question={questions.otherAims.question}
          shouldAddOtherOptionWithClarification={true}
        />
        <ErrorText>{errors.otherAims?.selectedValues?.message}</ErrorText>

        {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
        <ButtonSubmit isSubmitting={isSubmitting} />
      </Form>
    </MainFormDiv>
  )
}

export default RestorationAimsForm
