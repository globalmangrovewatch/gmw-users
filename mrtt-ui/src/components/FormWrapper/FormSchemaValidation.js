import * as yup from 'yup'

import emptyFeatureCollection from '../../data/emptyFeatureCollection'

import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '../../validation/multiSelectWithOther'

const siteAreaError = 'Please provide a site area'

export const validationSchema = yup.object().shape({
  // project details
  projectStartDate: yup.date().required('Select a start date'),
  hasProjectEndDate: yup.boolean(),
  projectEndDate: yup.date().when('hasProjectEndDate', {
    is: (endDate) => endDate === true,
    then: yup
      .date()
      .min(yup.ref('projectStartDate'), "End date can't be before start date")
      .required('Please select an end date')
  }),
  countries: yup
    .array()
    .of(
      yup.object().shape({
        bbox: yup.array().of(yup.number()),
        geometry: yup.object().shape({
          coordinates: yup.array().of(yup.number()),
          type: yup.string()
        }),
        properties: yup.object().shape({
          country: yup.string(),
          mangroves: yup.string()
        })
      })
    )
    .min(1)
    .typeError('Select at least one country'),
  siteArea: yup
    .object()
    .shape({
      features: yup.array().min(1, siteAreaError).required(siteAreaError)
    })
    .required(siteAreaError),

  // site background
  stakeholders: yup
    .array()
    .of(
      yup.object().shape({
        stakeholderType: yup.string(),
        stackholderName: yup.string()
      })
    )
    .min(1)
    .required('Select at least one stakeholder'),
  managementStatus: yup.string(),
  lawStatus: yup.string(),
  managementArea: yup.string(),
  protectionStatus: multiselectWithOtherValidationNoMinimum,
  areStakeholdersInvolved: yup.string().nullable(),
  governmentArrangement: multiselectWithOtherValidationNoMinimum,
  landTenure: multiselectWithOtherValidationNoMinimum,
  customaryRights: yup.string(),
  // restoration aims
  ecologicalAims: multiselectWithOtherValidation,
  socioEconomicAims: multiselectWithOtherValidation,
  otherAims: multiselectWithOtherValidationNoMinimum
})

export const defaultValues = {
  // project details - Site Details and Location
  projectStartDate: null,
  hasProjectEndDate: false,
  projectEndDate: null,
  countries: undefined,
  siteArea: emptyFeatureCollection,

  // site background - Site Background
  protectionStatus: { selectedValues: [], otherValue: undefined },
  landTenure: { selectedValues: [], otherValue: undefined },

  // restoration aims - Restoration Aims
  ecologicalAims: { selectedValues: [], otherValue: undefined },
  socioEconomicAims: { selectedValues: [], otherValue: undefined },
  otherAims: { selectedValues: [], otherValue: undefined }
}
