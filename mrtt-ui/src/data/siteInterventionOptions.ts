export const propaguleOptions = [
  'Collected from mangrove areas and/or riverbank',
  'Unknown',
  'Other'
] as const satisfies readonly string[]

export const seedlingOptions = [
  'From a nursery',
  'Transplanted - no roots and soil',
  'Transplanted - with roots and soil',
  'Unknown',
  'Other'
] as const satisfies readonly string[]

export const sourceOptions = ['Nursery', 'Wild', 'Both'] as const satisfies readonly string[]

export const purposeOptions = [
  'Coastal defence',
  'Source of food',
  'Products for sale',
  'Traditional medicines',
  'Other',
  'Not applicable'
] as const satisfies readonly string[]
