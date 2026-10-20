import language from '@/language'
import * as yup from 'yup'

export const otherIsCheckedButInputIsEmptyValidation = <S extends yup.AnySchema>(schema: S) =>
  schema.test({
    name: 'isOtherCheckedAndEmpty',
    message: language.multiselectWithOtherFormQuestion.validation.clairfyOther,
    test: (_value, context) => {
      const { otherValue } = context.parent as { otherValue?: string }
      return otherValue !== undefined && otherValue !== ''
    }
  })

export const multiselectWithOtherValidation = yup.object({
  selectedValues: yup
    .array()
    .default([])
    .when('isOtherChecked', {
      is: false,
      then: (schema) =>
        schema.min(1, language.multiselectWithOtherFormQuestion.validation.selectAtleastOneItem),
      otherwise: otherIsCheckedButInputIsEmptyValidation
    }),
  otherValue: yup.string(),
  isOtherChecked: yup.bool().default(false)
})

export const multiselectWithOtherValidationNoMinimum = yup.object({
  selectedValues: yup.array().default([]).when('isOtherChecked', {
    is: false,
    otherwise: otherIsCheckedButInputIsEmptyValidation
  }),
  otherValue: yup.string(),
  isOtherChecked: yup.bool().default(false)
})
