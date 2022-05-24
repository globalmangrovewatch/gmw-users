const projectDetails = {
  hasProjectEndDate: {
    question: '1.1a Does the project have an end date?'
  },
  projectStartDate: {
    question: '1.1b'
  },
  projectEndDate: {
    question: '1.1c'
  },
  countries: {
    question: '1.2 What country/countries is the site located in?'
  },
  siteArea: {
    question: '1.3 What is the overall site area?'
  }
}

const siteBackground = {
  stakeholders: {
    question: '2.1 Which stakeholders are involved in the project activities?',
    options: [
      'Local community representatives',
      'Local leaders',
      'Indigenous peoples',
      'Traditionally marginalised or underrepresented groups',
      'Landowners/customary area owners',
      'National, central or federal government',
      'Sub-national, regional or state government',
      'Local or municipal government',
      'Overseas government agencies ',
      'Intergovernmental agencies',
      'Managed area manager/personnel',
      'International or national NGO',
      'Small-scale local NGO',
      'Community based organisations, associations or cooperatives',
      'Industry/Private sector',
      'Academic institute or research facility',
      'Ecotourists',
      'Unknown',
      'Other'
    ]
  },
  managementStatus: {
    question:
      '2.2 What was the management status of the site immediately before the project started?',
    options: [
      'Protected informally at a local level',
      'Protection is formally recognized at the state/province/regional level',
      'Protection is formally recognized at a national level',
      'Protection is formally recognized at an international level',
      'None',
      'Unknown'
    ]
  },
  lawStatus: {
    question:
      '2.3 Are management activities at the site recognized in statutory or customary laws?',
    options: [
      'Yes - statutory',
      'Yes - customary',
      'No',
      'Partially - statutory',
      'Partially - customary'
    ]
  },
  managementArea: {
    question: '2.4 Name of the formal management area the site is contained within (if relevant)?'
  },
  protectionStatus: {
    question:
      '2.5 How would you describe the protection status of the site immediately before the project started?',
    options: ['Full protection', 'Partial protection', 'Sustainable use', 'No management']
  },
  areStakeholdersInvolved: {
    question:
      '2.6 Are the stakeholders involved in project activities able to influence site management rules?',
    options: ['Yes', 'No', 'Partially']
  },
  govermentArrangement: {
    question:
      '2.7 What best describes the governance arrangement of the site immediately before the project started?',
    options: [
      'Governance by government',
      'Shared governance',
      'Private governance',
      'Governance by indigenous peoples and local communities',
      'Mixed governance',
      'None',
      'Unknown'
    ]
  },
  landTenure: {
    question: '2.8 What was the land tenure of the site immediately before the project started?',
    options: [
      'Private - individual',
      'Private - business',
      'Customary',
      'Communal',
      'Sub-national or local government',
      'National government',
      'Unknown'
    ]
  },
  customaryRights: {
    question: '2.9 Are customary rights to land within the site recognised in national law?',
    options: ['Yes', 'No', 'Partially']
  }
}

const restorationAims = {
  ecologicalAims: {
    question: '3 .1 What are the ecological aim(s) of the project activities at the site?',
    options: [
      'Increase mangrove area',
      'Improve mangrove condition/halt or reduce degradation',
      'Increase mangrove species richness',
      'Offset mangrove loss from another area',
      'Habitat protection',
      'Increase native fauna/wildlife',
      'Increase native flora/vegetation (non-mangrove)',
      'Reduce invasive species',
      'Increase ecological resilience',
      'Increase habitat connectivity',
      'Restore hydrological connectivity',
      'Improve sediment dynamics',
      'Improve nutrient cycling',
      'Increase carbon storage and sequestration',
      'None',
      'Unknown'
    ]
  },
  socioEconomicAims: {
    question: '3.2 What are the socio-economic aim(s) of project activities at the site?',
    options: [
      'Enhance fisheries/restore fishing grounds',
      'Provide sustainable timber resources',
      'Provide sustainable non-timber products ',
      'Improve water quality',
      'Prevent or ameliorate pollution',
      'Coastal storm or flood protection',
      'Erosion control or coastal stability',
      'Carbon offsets/trading',
      'Tourism and recreation',
      'Land reclamation',
      'Generate employment and income',
      "Promote women's equal representation and participation in employment",
      'Safeguard cultural or spiritual importance',
      'Safeguard traditional practises',
      'Increase food security',
      'Secure management rights and land tenure',
      'Improve local community health',
      'Coastal beautification or aesthetic value',
      'Support local community natural resource management institutions',
      'Encourage community involvement',
      'Education/raise environmental awareness',
      'Sustainable financing',
      'None',
      'Unknown'
    ]
  },
  otherAims: {
    question: '3.3 What are the other aim(s) of project activities at the site?',
    options: [
      'Have site designated as a protected area',
      'Meet international commitments/national targets',
      'Influence government policy',
      'Improve restoration techniques',
      'Answer scientific research questions',
      'None'
    ]
  }
}

const causesOfDecline = {
  lossKnown: {
    question: '4.1 Is the cause(s) of mangrove loss or degradation at the site known?'
  },
  causesOfDecline: {
    question: '4.2 What were the major cause(s) of mangrove loss or degradation at the site?'
  }
}

export { projectDetails, siteBackground, restorationAims, causesOfDecline }
