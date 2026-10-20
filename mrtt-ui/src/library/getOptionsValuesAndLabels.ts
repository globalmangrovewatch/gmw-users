const getOptionsValuesAndLabels = (answers) =>
  answers.map((answer) => ({
    label: answer,
    value: answer
  }))

export default getOptionsValuesAndLabels
