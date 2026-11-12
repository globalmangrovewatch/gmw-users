import { z } from 'zod'

import {
  addIssue,
  isEmpty,
  nullableText,
  text,
  type SectionRefine,
  type SectionShape
} from './fields'

export const shape = {
  lossKnown: text,
  causesOfDecline: z
    .array(
      z.object({
        mainCauseLabel: text,
        mainCauseAnswers: z
          .array(z.object({ mainCauseAnswer: text, levelOfDegradation: nullableText }))
          .optional(),
        subCauses: z
          .array(
            z.object({
              subCauseLabel: text,
              subCauseAnswers: z
                .array(z.object({ subCauseAnswer: text, levelOfDegradation: nullableText }))
                .optional()
            })
          )
          .optional()
      })
    )
    .optional()
} satisfies SectionShape<'causesOfDecline'>

type Answer = { levelOfDegradation?: unknown }
type Cause = { mainCauseAnswers?: unknown; subCauses?: unknown }
type SubCause = { subCauseAnswers?: unknown }

const asArray = <T>(value: unknown) => (Array.isArray(value) ? (value as T[]) : [])

// Every answer needs a level of degradation. The message names the field by its path,
// e.g. `causesOfDecline[0].mainCauseAnswers[0].levelOfDegradation is a required field`.
export const refine: SectionRefine = (values, ctx) => {
  const requireLevel = (answer: Answer, path: (string | number)[]) => {
    if (!isEmpty(answer?.levelOfDegradation)) return
    const name = path.reduce<string>(
      (acc, key) => (typeof key === 'number' ? `${acc}[${key}]` : acc ? `${acc}.${key}` : key),
      ''
    )
    addIssue(ctx, [...path, 'levelOfDegradation'], `${name}.levelOfDegradation is a required field`)
  }

  asArray<Cause>(values.causesOfDecline).forEach((cause, i) => {
    asArray<Answer>(cause?.mainCauseAnswers).forEach((answer, j) =>
      requireLevel(answer, ['causesOfDecline', i, 'mainCauseAnswers', j])
    )
    asArray<SubCause>(cause?.subCauses).forEach((subCause, j) =>
      asArray<Answer>(subCause?.subCauseAnswers).forEach((answer, k) =>
        requireLevel(answer, ['causesOfDecline', i, 'subCauses', j, 'subCauseAnswers', k])
      )
    )
  })
}
