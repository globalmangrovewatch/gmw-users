const formatApiAnswersForForm = ({ apiAnswers, questionMapping }) => {
  // questionMapping type is an object with one level of properties with string values

  const questionIdEntries = Object.entries(questionMapping)

  const answersForUiFormEntries = questionIdEntries.map((question) => {
    const [frontEndAnswerId, apiAnswerId] = question
    const apiAnswer = apiAnswers.find((apiAnswer) => apiAnswer.question_id === apiAnswerId)

    return [frontEndAnswerId, apiAnswer?.answer_value]
  })

  return Object.fromEntries(answersForUiFormEntries)
}

export default formatApiAnswersForForm
