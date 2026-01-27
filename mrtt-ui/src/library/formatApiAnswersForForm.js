import { defaultValues } from '../components/FormWrapper/FormSchemaValidation'
export const formatApiAnswersForForm = ({ apiAnswers, questionMapping }) => {
  // questionMapping type is an object with one level of properties with string values

  const questionIdEntries = Object.entries(questionMapping)

  const answersForUiFormEntries = questionIdEntries.map((question) => {
    const [frontEndAnswerId, apiAnswerId] = question
    const apiAnswer = apiAnswers.find((apiAnswer) => apiAnswer.question_id === apiAnswerId)

    return [frontEndAnswerId, apiAnswer?.answer_value || defaultValues[frontEndAnswerId]]
  })

  return Object.fromEntries(answersForUiFormEntries, defaultValues)
}

export const formatApiAnswersForFormByKey = ({ apiAnswers, questionMapping }) => {
  const answersById = Object.fromEntries(apiAnswers.map((a) => [a.question_id, a.answer_value]))

  const result = {}

  Object.entries(questionMapping).forEach(([sectionKey, sectionMapping]) => {
    result[sectionKey] = {}

    Object.entries(sectionMapping).forEach(([fieldKey, questionId]) => {
      let apiValue = answersById[questionId]

      // MUI specific: cast 'true'/'false' strings to boolean
      if (apiValue === 'true') apiValue = true
      if (apiValue === 'false') apiValue = false

      const hasValue =
        apiValue !== undefined &&
        apiValue !== null &&
        !(typeof apiValue === 'string' && apiValue.trim() === '')

      result[sectionKey][fieldKey] = hasValue ? apiValue : defaultValues[fieldKey]
    })
  })
  return result
}

export default formatApiAnswersForForm
