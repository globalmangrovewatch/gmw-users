export const causesOfDeclineOptions = [
  {
    label: 'Residential & commercial development',
    children: [
      'Housing & urban areas',
      'Commercial & industrial areas',
      'Tourism & recreation areas'
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
          'Scale Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Wood & pulp plantations',
        secondaryChildren: [
          'Small-holder plantations',
          'Agro-industry plantations',
          'Scale Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Livestock farming & ranching',
        secondaryChildren: [
          'Nomadic grazing',
          'Small-holder grazing, ranching or farming',
          'Agro-industry grazing, ranching or farming',
          'Scale Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Marine & freshwater aquaculture',
        secondaryChildren: [
          'Subsistence/artisanal aquaculture',
          'Industrial aquaculture',
          'Scale Unknown/Unrecorded'
        ]
      }
    ]
  },
  {
    label: 'Energy production & mining',
    children: ['Oil & gas drilling', 'Mining & quarrying', 'Renewable energy']
  },
  {
    label: 'Transportation & service corridors',
    children: ['Roads & railroads', 'Utility & service lines', 'Shipping lanes', 'Flight paths']
  },
  {
    label: 'Biological resource use',
    children: [
      {
        secondaryLabel: 'Hunting & collecting terrestrial animals',
        secondaryChildren: [
          'Intentional use (species being assessed is the target)',
          'Unintentional effects (species being assessed is not the target)',
          'Persecution/control',
          'Motivation Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Gathering terrestrial plants',
        secondaryChildren: [
          'Intentional use (species being assessed is the target)',
          'Unintentional effects (species being assessed is not the target)',
          'Persecution/control',
          'Motivation Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Logging & wood harvesting',
        secondaryChildren: [
          'Intentional use: subsistence/small scale (species being assessed is the target [harvest])',
          'Intentional use: large scale (species being assessed is the target)[harvest]',
          'Unintentional effects: subsistence/small scale (species being assessed is not the target)[harvest]',
          'Unintentional effects: large scale (species being assessed is not the target)[harvest]',
          'Motivation Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Fishing & harvesting aquatic resources',
        secondaryChildren: [
          'Intentional use: subsistence/small scale (species being assessed is the target)[harvest]',
          'Intentional use: large scale (species being assessed is the target)[harvest]',
          'Unintentional effects: subsistence/small scale (species being assessed is not the target)[harvest]',
          'Unintentional effects: large scale (species being assessed is not the target)[harvest]',
          'Persecution/control',
          'Motivation Unknown/Unrecorded'
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
          'Suppression in fire frequency/intensity',
          'Trend Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Dams & water management/use',
        secondaryChildren: [
          'Abstraction of surface water (domestic use)',
          'Abstraction of surface water (commercial use)',
          'Abstraction of surface water (agricultural use)',
          'Abstraction of surface water (unknown use)',
          'Abstraction of ground water (domestic use)',
          'Abstraction of ground water (commercial use)',
          'Abstraction of ground water (agricultural use)',
          'Abstraction of ground water (unknown use)',
          'Small dams',
          'Large dams',
          'Dams (size unknown)'
        ]
      },
      { secondaryLabel: 'Other ecosystem modifications', secondaryChildren: [] }
    ]
  },
  {
    label: 'Invasive & other problematic species, genes & diseases',
    children: [
      {
        secondaryLabel: 'Invasive non-native/alien species/diseases',
        secondaryChildren: ['Unspecified species', 'Named species']
      },
      {
        secondaryLabel: 'Problematic native species/diseases',
        secondaryChildren: ['Unspecified species', 'Named species']
      },
      {
        secondaryLabel: 'Introduced genetic material',
        secondaryChildren: []
      },
      {
        secondaryLabel: 'Problematic species/diseases of unknown origin',
        secondaryChildren: ['Unspecified species', 'Named species']
      },
      {
        secondaryLabel: 'Viral/prion-induced diseases',
        secondaryChildren: ['Unspecified "species" (disease)', 'Named "species" (disease)']
      },
      {
        secondaryLabel: 'Diseases of unknown cause',
        secondaryChildren: []
      }
    ]
  },
  {
    label: 'Pollution',
    children: [
      {
        secondaryLabel: 'Domestic & urban waste water',
        secondaryChildren: ['Sewage', 'Run-off', 'Type Unknown/Unrecorded']
      },
      {
        secondaryLabel: 'Industrial & military effluents',
        secondaryChildren: ['Oil spills', 'Seepage from mining', 'Type Unknown/Unrecorded']
      },
      {
        secondaryLabel: 'Agricultural & forestry effluents',
        secondaryChildren: [
          'Nutrient loads',
          'Soil erosion, sedimentation',
          'Herbicides & pesticides',
          'Type Unknown/Unrecorded'
        ]
      },
      {
        secondaryLabel: 'Garbage & solid waste',
        secondaryChildren: []
      },
      {
        secondaryLabel: 'Air-borne pollutants',
        secondaryChildren: ['Acid rain', 'Smog', 'Ozone', 'Type Unknown/Unrecorded']
      },
      {
        secondaryLabel: 'Excess energy',
        secondaryChildren: [
          'Light pollution',
          'Thermal pollution',
          'Noise pollution',
          'Type Unknown/Unrecorded'
        ]
      }
    ]
  },
  {
    label: 'Geological events',
    children: ['Volcanoes', 'Earthquakes/tsunamis', 'Avalanches/landslides']
  },
  {
    label: 'Climate change & severe weather',
    children: [
      'Habitat shifting & alteration',
      'Droughts',
      'Temperature extremes',
      'Storms & flooding',
      'Other impacts'
    ]
  },
  {
    label: 'Other options',
    children: ['Other threat']
  }
]
