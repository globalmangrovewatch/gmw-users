import { questionMapping } from '../data/questionMapping'

// set up data structure for api using question_id and answer_value object
// ensure formTitle is the same is title in questionMapping
export const mapDataForApi = (formTitle, data) => {
  const preppedData = []

  for (const [key, value] of Object.entries(data)) {
    // longer version of Object.hasOwnProperty
    if (Object.prototype.hasOwnProperty.call(questionMapping[formTitle], key)) {
      // map question ids with descriptive question keys
      preppedData.push({ question_id: questionMapping[formTitle][key], answer_value: value })
    }
  }
  return preppedData
}
