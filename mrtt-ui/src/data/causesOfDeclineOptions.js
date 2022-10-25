export const causesOfDeclineOptions = [
  {
    label: 'Residential & commercial development',
    children: [
      'Housing & urban areas',
      'Commercial & industrial areas e.g. ports, oil refineries',
      'Tourism & recreation areas',
      'Land reclamation'
    ]
  },
  {
    label: 'Agriculture & aquaculture',
    children: [
      {
        secondaryLabel: 'Annual & perennial non-timber crops',
        secondaryChildren: [
          'Shifting agriculture',
          'Small-holder farming',
          'Agro-industry farming',
          'Rice',
          'Coconuts',
          'Limes',
          'Other crops'
        ]
      },
      {
        secondaryLabel: 'Wood & pulp plantations',
        secondaryChildren: [
          'Small-holder plantations',
          'Agro-industry plantations',
          'Oil palm',
          'Eucalyptus'
        ]
      },
      {
        secondaryLabel: 'Livestock farming & ranching',
        secondaryChildren: [
          'Nomadic grazing',
          'Small-holder cattle grazing, ranching or farming',
          'Agro-industry cattle grazing, ranching or farming',
          'Goat, camel or yak herding'
        ]
      },
      {
        secondaryLabel: 'Marine & freshwater aquaculture',
        secondaryChildren: [
          'Subsistence/artisanal aquaculture',
          'Industrial aquaculture',
          'Fish aquaculture',
          'Shrimp aquaculture',
          'Seaweed farming'
        ]
      }
    ]
  },
  {
    label: 'Energy production & mining',
    children: [
      'Oil & gas drilling e.g. subsidence, habitat destruction',
      'Mining & quarrying',
      'Renewable energy'
    ]
  },
  {
    label: 'Transportation & service corridors',
    children: ['Roads & railroads', 'Oil and gas pipelines', 'Shipping lanes']
  },
  {
    label: 'Biological resource use',
    children: [
      {
        secondaryLabel: 'Resource use',
        secondaryChildren: [
          'Hunting & collecting terrestrial animals',
          'Gathering terrestrial plants',
          'Salt pannes/ponds',
          'Coral burning'
        ]
      },
      {
        secondaryLabel: 'Logging & wood harvesting',
        secondaryChildren: [
          'Building materials',
          'Charcoal production',
          'Fuel wood collection',
          'Fish aggregation devices'
        ]
      },
      {
        secondaryLabel: 'Fishing & harvesting aquatic resources',
        secondaryChildren: [
          'Artisanal fishing',
          'Commercial fishing',
          'Seaweed collection',
          'Shellfish collection'
        ]
      }
    ]
  },
  {
    label: 'Human intrusions & disturbance',
    children: [
      'Recreational activities',
      'War, civil unrest & military exercises',
      'Work & other activities'
    ]
  },
  {
    label: 'Natural system modifications',
    children: [
      {
        secondaryLabel: 'Fire & fire suppression',
        secondaryChildren: [
          'Increase in fire frequency/intensity',
          'Suppression in fire frequency/intensity'
        ]
      },
      {
        secondaryLabel: 'Dams & water management/use',
        secondaryChildren: [
          'Hypersaline conditions',
          'Reduced sediment flows',
          'Reduction in flows/altered hydrology'
        ]
      }
    ]
  },
  {
    label: 'Invasive & other problematic species, genes & diseases',
    children: ['Invasive non-native/alien species/diseases', 'Problematic native species/diseases']
  },
  {
    label: 'Pollution',
    children: [
      {
        secondaryLabel: 'Domestic & urban waste water',
        secondaryChildren: ['Sewage', 'Run-off', 'Garbage & solid waste']
      },
      {
        secondaryLabel: 'Industrial & military effluents',
        secondaryChildren: ['Oil spills', 'Seepage from mining', 'Other industrial effluents']
      },
      {
        secondaryLabel: 'Agricultural & forestry effluents',
        secondaryChildren: [
          'Nutrient loads',
          'Soil erosion, sedimentation',
          'Herbicides & pesticides'
        ]
      }
    ]
  },
  {
    label: 'Geological events',
    children: ['Volcanoes', 'Earthquakes/tsunamis', 'Avalanches/landslides', 'Erosion']
  },
  {
    label: 'Climate change & severe weather',
    children: [
      'Habitat shifting & alteration',
      'Sea level change',
      'Droughts',
      'Temperature extremes',
      'Storms & flooding'
    ]
  },
  {
    label: 'Other options',
    children: ['Other threat']
  }
]
