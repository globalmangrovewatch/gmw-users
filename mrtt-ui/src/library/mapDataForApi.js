import { questionMapping } from '../data/questionMapping'

// set up data structure for api using question_id and answer_value object
// ensure formTitle is the same is title in questionMapping
export const mapDataForApi = (formTitle, data) => {
  const preppedData = []

  for (const [fieldName, uiAnswer] of Object.entries(data)) {
    const apiQuestionId = questionMapping[formTitle]?.[fieldName]
    if (apiQuestionId) {
      preppedData.push({
        question_id: apiQuestionId,
        answer_value: uiAnswer
      })
    }
  }
  return preppedData
}
