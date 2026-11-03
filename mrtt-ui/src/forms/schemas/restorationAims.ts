import {
  multiselectWithOtherValidation,
  multiselectWithOtherValidationNoMinimum
} from '@/validation/multiSelectWithOther'
import type { SectionShape } from './fields'

export const shape = {
  ecologicalAims: multiselectWithOtherValidation,
  socioEconomicAims: multiselectWithOtherValidation,
  otherAims: multiselectWithOtherValidationNoMinimum
} satisfies SectionShape<'restorationAims'>

export const defaultValues = {
  ecologicalAims: { selectedValues: [], otherValue: undefined },
  socioEconomicAims: { selectedValues: [], otherValue: undefined },
  otherAims: { selectedValues: [], otherValue: undefined }
}
