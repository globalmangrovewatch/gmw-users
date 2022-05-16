import { questionMapping } from '../data/questionMapping'

// set up data structure for api
// ensure formTitle is the same is title in questionMapping
export const mapDataForApi = (formTitle, data) => {
  const preppedData = []
  for (const [key, value] of Object.entries(data)) {
    // map question ids with keys
    // longer version of Object.hasOwnProperty
    // checks if key exists in question mapping section, then gets value of that key to use with question_id
    if (Object.prototype.hasOwnProperty.call(questionMapping[formTitle], key)) {
      preppedData.push({ question_id: questionMapping[formTitle][key], answer_value: value })
    }
  }
  return preppedData
}
