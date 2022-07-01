export const findDataItem = (registrationAnswersFromServer, questionId) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === questionId)
    ?.answer_value
