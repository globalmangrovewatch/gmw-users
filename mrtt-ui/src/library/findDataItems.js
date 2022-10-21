export const findRegistationDataItem = (registrationAnswersFromServer, questionId) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === questionId)
    ?.answer_value

export const findMonitoringDataItem = (registrationAnswersFromServer, questionId) =>
  registrationAnswersFromServer?.data?.answers?.find(
    (dataItem) => dataItem.question_id === questionId
  )?.answer_value
