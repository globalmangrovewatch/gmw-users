import { z } from 'zod'

import language from '@/language'

const messages = language.multiselectWithOtherFormQuestion.validation

// `.default({})` rather than `.optional()`, which would skip the refinement below for a
// missing answer.
const multiselectWithOther = z
  .object({
    selectedValues: z.array(z.unknown()).optional(),
    otherValue: z.string().optional(),
    isOtherChecked: z.boolean().optional()
  })
  .default({})

// When "Other" is checked its text is required; otherwise at least one item is, unless
// `requireOne` is false. Errors go on `selectedValues`, which is where the UI reads them.
const withOtherRules = (requireOne: boolean) =>
  multiselectWithOther.superRefine((value, ctx) => {
    const path = ['selectedValues']
    if (value.isOtherChecked) {
      if (!value.otherValue) {
        ctx.addIssue({ code: 'custom', message: messages.clairfyOther, path })
      }
    } else if (requireOne && !value.selectedValues?.length) {
      ctx.addIssue({ code: 'custom', message: messages.selectAtleastOneItem, path })
    }
  })

export const multiselectWithOtherValidation = withOtherRules(true)

export const multiselectWithOtherValidationNoMinimum = withOtherRules(false)
