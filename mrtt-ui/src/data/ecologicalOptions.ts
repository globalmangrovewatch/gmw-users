export const comparisonOptions = [
  'None',
  'Before Measurement',
  'Comparison Site',
  'Literature Value',
  'International'
] as const satisfies readonly string[]

export const unitOptions = ['m²', 'km²', 'ha', 'other'] as const satisfies readonly string[]
