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

const pages = {
  organizations: {
    title: 'Organizations',
    titleOtherOrganizations: 'Other Organizations',
    titleYourOrganizations: 'Your Organizations'
  },
  sites: { title: 'Sites', newSiteButton: 'New Site' }
}

export default { error, form, multiselectWithOtherFormQuestion, pages }
