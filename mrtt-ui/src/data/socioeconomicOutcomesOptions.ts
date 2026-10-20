export const TypeOptions = ['Observed', 'Quantitative'] as const satisfies readonly string[]

export const TrendOptions = ['Positive', 'Stable', 'Negative'] as const satisfies readonly string[]

export const ComparisonOptions = [
  'None',
  'Before Measurement',
  'Comparison Site',
  'Literature Value',
  'International Standard'
] as const satisfies readonly string[]
