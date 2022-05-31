const error = {
  submit: 'Submit failed. please try again.',
  apiLoad: 'Loading data from the api failed. Please try again.'
}
const form = {
  checkboxGroupOtherLabel: 'Other',
  checkboxGroupOtherInputPlaceholder: 'If other, please state.'
}
const multiselectWithOtherFormQuestion = {
  validation: {
    selectAtleastOneItem: 'Please select at least one item.',
    clairfyOther: 'Please clarify other item.'
  }
}

const maybePluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`

const projectAreaMap = {
  siteArea: 'Site Area',
  getLineAndPointCounts: (lineCount, pointCount) => {
    const fileContains = 'Uploaded file contains'
    const notIncluded = 'which will not be included in the site area'

    if (lineCount && pointCount) {
      return `${fileContains} ${maybePluralize(lineCount, 'line')} and ${maybePluralize(
        pointCount,
        'point'
      )} ${notIncluded}.`
    }

    if (lineCount) {
      return `${fileContains} ${maybePluralize(lineCount, 'line')} ${notIncluded}.`
    }

    if (pointCount) {
      return `${fileContains} ${maybePluralize(pointCount, 'point')} ${notIncluded}.`
    }
  }
}

export default { error, form, multiselectWithOtherFormQuestion, projectAreaMap }
