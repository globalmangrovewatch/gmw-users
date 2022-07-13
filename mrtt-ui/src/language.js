const error = {
  apiLoad: 'Loading data from the api failed. Please try again.',
  delete: 'Deleting that item failed. Please try again.',
  getItemDoesntExistMessage: (item) => `That ${item} doesnt exist.`,
  submit: 'Saving failed. Please try again.'
}

const success = {
  submit: 'The data has been saved.',
  getEditThingSuccessMessage: (thing) => `${thing} has been edited.`,
  getCreateThingSuccessMessage: (thing) => `${thing}, has been created.`,
  getDeleteThingSuccessMessage: (thing) => `${thing} has been deleted.`
}
const form = {
  checkboxGroupOtherInputPlaceholder: 'If other, please state.',
  checkboxGroupOtherLabel: 'Other',
  navigateBackToSiteOverview: 'Return to site form overview',
  selectLabel: 'Select',
  requiredIndicator: 'Indicates required field',
  error: {
    yearTooLow: 'Year must be greater than 1900',
    noYearProvided: 'You must specifiy a year',
    yearTooHigh: 'Year must less than or equal to the current year'
  }
}
const multiselectWithOtherFormQuestion = {
  validation: {
    selectAtleastOneItem: 'Please select at least one item.',
    clairfyOther: 'Please clarify other item.'
  }
}

const pages = {
  organizations: {
    newOrganizationButton: 'New Org',
    noOtherOrganizations: 'There are no other organizations',
    noYourOrganizations: 'You dont have any organizations',
    title: 'Organizations',
    titleOtherOrganizations: 'Other Organizations',
    titleYourOrganizations: 'Your Organizations'
  },
  organizationForm: {
    labelName: 'name',
    organization: 'organization',
    titleEdit: 'Edit Organization',
    titleNew: 'New Organization',
    validation: {
      nameRequired: 'Please enter a name'
    }
  },
  sites: { title: 'Sites', newSiteButton: 'New Site' },
  landscapeForm: {
    delete: 'Delete this landscape',
    deletePropmt: {
      title: 'Delete Landscape',
      propmtText: 'Are you sure you wan to delete this landscape?',
      buttonText: 'Yes, delete this landscape'
    },
    isAssociatedSites:
      'You must change the associated sites to another landscape before you can delete this landscape.',
    labelName: 'Name',
    labelOrganizations: 'Organizations',
    landscape: 'landscape',
    noAssociatedSites: 'This landscape has no associated sites.',
    titleEdit: 'Edit Landscape',
    titleNew: 'New Landscape',
    validation: {
      nameRequired: 'Please enter a name.',
      organizationRequired: 'Please choose at least one organization.'
    }
  },
  landscapes: {
    newLandscapeButton: 'New Landscape',
    noOrganizarions: 'No organizations in this landscape',
    noSites: 'No sites in this landscape',
    organizations: 'Organizations',
    sites: 'Sites',
    title: 'Landscapes'
  },
  siteform: {
    titleEditSite: 'Site Settings',
    titleNewSite: 'Create a site',
    labelName: 'Site Name',
    labelLandscape: 'Landscape',
    site: 'site',
    validation: {
      nameRequired: 'Please enter a name',
      landscapeRequired: 'Please select a landscape'
    }
  },
  siteQuestionsOverview: {
    settings: 'Settings',

    formGroupTitle: {
      intervention: 'Intervention',
      monitoring: 'Monitoring',
      registration: 'Registration'
    },
    formName: {
      siteDetails: 'Site Details and Location',
      siteBackground: 'Site Background',
      restorationAims: 'Restoration Aims',
      causesOfDecline: 'Causes of Decline',
      preRestorationAssessment: 'Pre-Restoration Assessment',
      siteInterventions: 'Site Interventions',
      costs: 'Costs',
      managementStatus: 'Management Status and Effectiveness',
      socioeconomicGovernanceStatusOutcomes: 'Socioeconomic and Governance Status and Outcomes',
      ecologicalStatusOutcomes: 'Ecological Status and Outcomes'
    },
    addMonitoringSectionButton: 'Add Monitoring Section'
  }
}

const buttons = {
  cancel: 'Cancel',
  deleting: 'Deleting...',
  edit: 'Edit',
  save: 'Save',
  saving: 'Saving...',
  submit: 'Submit',
  submitting: 'Submitting...'
}

const maybePluralize = (count, noun, suffix = 's') => `${count} ${noun}${count !== 1 ? suffix : ''}`

const projectAreaMap = {
  dropzoneText:
    'Click or drag and drop a file here. Accepted formats are geojson, KML and shapefile. Shapefiles must be provided as a .zip file containing the minimum set of shapefile files (.shp, .shx and .dbf).',
  siteArea: 'Site Area',
  siteAreaInstructions:
    'Draw the site area on the map or upload from file. Uploaded geometry can be edited. Only polygon geometry from uploaded files will be included. Lines and points will be ignored. ',
  uploadErrorPrefix:
    'Please check that your uploaded file contains valid geometry. An error occured uploading site area',
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

const header = {
  logout: 'Logout'
}

const questionNav = {
  returnToSite: 'Return to Site Form Overview',
  previousSection: 'Previous Section',
  nextSection: 'Next Section',
  private: 'Private',
  public: 'Public'
}

export default {
  buttons,
  error,
  form,
  header,
  multiselectWithOtherFormQuestion,
  pages,
  projectAreaMap,
  questionNav,
  success
}
