const error = {
  apiLoad: 'Loading data from the api failed. Please try again.',
  delete: 'Deleting that item failed. Please try again.',
  getItemDoesntExistMessage: (item) => `That ${item} doesnt exist.`,
  generic: 'Something went wrong. Please try again.',
  submit: 'Saving failed. Please try again.'
}

const success = {
  getCreateThingSuccessMessage: (thing) => `${thing}, has been created.`,
  getDeleteThingSuccessMessage: (thing) => `${thing} has been deleted.`,
  getEditThingSuccessMessage: (thing) => `${thing} has been edited.`,
  signup: 'Please check your email for verification instructions.',
  submit: 'The data has been saved.'
}
const form = {
  checkboxGroupOtherInputPlaceholder: 'If other, please state.',
  checkboxGroupOtherLabel: 'Other',
  error: {
    yearTooLow: 'Year must be greater than 1900',
    noYearProvided: 'You must specifiy a year',
    yearTooHigh: 'Year must less than or equal to the current year'
  },
  navigateBackToSiteOverview: 'Return to site form overview',
  required: 'This is a required field',
  requiredIndicator: 'Indicates required field',
  selectLabel: 'Select',
  tabularDeletePrompt: {
    title: 'Delete Row: ',
    promptText: 'Are you sure you want to delete this row?',
    buttonText: 'Yes, delete this row'
  },
  validationAlert: {
    title: 'The form was not saved',
    description: 'Please check the form below for validation errors'
  },
  deleteForm: 'Delete Form',
  deletePrompt: {
    title: 'Delete Form: ',
    promptText: 'Are you sure you want to delete this form?',
    buttonText: 'Yes, delete this form'
  }
}

const multiselectWithOtherFormQuestion = {
  validation: {
    selectAtleastOneItem: 'Please select at least one item.',
    clairfyOther: 'Please clarify other item.'
  }
}

const pages = {
  login: {
    title: 'Login',
    email: 'Email',
    password: 'Password',
    signUp: 'Sign Up',
    forgotPassowrd: 'Forgot Password'
  },
  socioeconomicGovernanceStatusOutcomes: {
    missingSocioeconomicAims: 'Please select aims from question 3.2 in the Restoration Aims form'
  },
  costs: {
    missingInterventionsWarning:
      'Please select interventions from question 6.2a and 6.4 in the Site Interventions form'
  },
  restorationAims: {
    missingStakeholdersWarning:
      'In order to rank the importance of aims, questions 2.1 will need to be filled out in the Site Background form.'
  },
  userSignUp: {
    confirmPassword: 'Re-type password',
    email: 'Email',
    name: 'Name',
    password: 'Password',
    title: 'Sign Up',
    validation: {
      emailValid: 'Must be a valid email',
      passwordMinimumCharacters: 'Password must be at the minimum 8 characters long',
      passwordsMustMatch: 'Passwords must match'
    }
  },
  resetPassword: {
    confirmPassword: 'Re-type  new password',
    password: ' New password',
    success: 'Your password has been reset. Please use it to log in.',
    title: 'Reset Password',
    validation: {
      passwordMinimumCharacters: 'Password must be at the minimum 8 characters long',
      passwordsMustMatch: 'Passwords must match'
    }
  },
  forgotPassword: {
    title: 'Forgot Password',
    email: 'Email',
    success:
      'Your request has been submitted. If you have an account with that email address, you will receive an email with further instructions.'
  },
  organizations: {
    manageUsers: 'Manage users',
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
  sites: { title: 'Sites', newSiteButton: 'New Site', lastUpdated: 'Last updated' },
  landscapeForm: {
    delete: 'Delete this landscape',
    deletePrompt: {
      title: 'Delete Landscape',
      promptText: 'Are you sure you want to delete this landscape?',
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
    labelDefaultSectionPrivacy: 'Default Data Privacy',
    site: 'site',
    validation: {
      nameRequired: 'Please enter a name',
      landscapeRequired: 'Please select a landscape'
    }
  },
  manageOrganizationUsers: {
    delete: 'Delete this user',
    deletePrompt: {
      title: 'Delete Organization User',
      getPromptText: ({ userName, organizationName }) =>
        `Are you sure you want to delete ${userName} from ${organizationName}?`,
      buttonText: 'Yes, delete this user'
    },
    newUser: 'New User',
    title: 'Users',
    usersTable: {
      name: 'Name',
      email: 'Email',
      admin: 'Admin',
      user: 'User',
      remove: 'Remove from Organization'
    }
  },
  newOrganizationUser: {
    backToUsers: 'Back to users',
    description: (
      <>
        If the new user is already a member, they will be added to this organization. If the user is
        not a member, they will be added automatically after they register at{' '}
        <a href='#'>PLACEHOLDER</a>
      </>
    ),
    email: "New user's email address",
    getTitle: (organization) => `New User for ${organization}`,
    getUserAdded: ({ userName, organizationName }) =>
      `The user, ${userName}, has been added to ${organizationName}`,
    getUserDoesntExist: (userName) => `The user, ${userName}, does not exist.`,
    orgAdmin: 'Admin',
    orgUser: 'User',
    role: 'Role'
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
      managementStatusAndEffectiveness: 'Management Status and Effectiveness',
      socioeconomicGovernanceStatusOutcomes: 'Socioeconomic and Governance Status and Outcomes',
      ecologicalStatusOutcomes: 'Ecological Status and Outcomes'
    },
    addMonitoringSectionButton: 'Add Monitoring Section',
    noMonitoringSections: "You don't have any monitoring sections for this site yet."
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
  nextSection: 'Next Section',
  previousSection: 'Previous Section',
  privacySaveError: "Saving this section's privacy failed. Please try again.",
  privacySavingSuccess: success.getEditThingSuccessMessage("This section's privacy"),
  privacySelectUndefined: 'Select Privacy',
  returnToSite: 'Return to Site Form Overview'
}

const sectionPrivacy = {
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
  sectionPrivacy,
  success
}
