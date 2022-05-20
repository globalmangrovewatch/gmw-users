import language from '../language'
import * as yup from 'yup'

export const otherIsCheckedButInputIsEmptyValidation = (schema) =>
  schema.test({
    name: 'isOtherCheckedAndEmpty',
    message: language.multiselectWithOtherFormQuestion.validation.clairfyOther,
    test: (value, context) => {
      const {
        parent: { otherValue }
      } = context
      return otherValue !== undefined && otherValue !== ''
    }
  })

export const multiselectWithOtherValidation = yup.object({
  selectedValues: yup
    .array()
    .of(yup.string())
    .when('isOtherChecked', {
      is: false || undefined,
      then: (schema) =>
        schema.min(1, language.multiselectWithOtherFormQuestion.validation.selectAtleastOneItem),
      otherwise: otherIsCheckedButInputIsEmptyValidation
    }),
  otherValue: yup.string(),
  isOtherChecked: yup.bool()
})
