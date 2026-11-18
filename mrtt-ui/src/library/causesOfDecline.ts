import type { RegistrationFormValues } from '@/forms/schemas'

/** One main cause of decline (4.2) as the form and the API store it. */
export type Cause = NonNullable<RegistrationFormValues['causesOfDecline']>[number]

/** A checkbox of question 4.2: an answer under a main cause, or under one of its sub causes. */
export type CauseOption = {
  mainCauseLabel: string
  subCauseLabel?: string
  answer: string
}

export const causeOptionKey = ({ mainCauseLabel, subCauseLabel, answer }: CauseOption) =>
  [mainCauseLabel, subCauseLabel, answer].filter(Boolean).join(' / ')

/** Keys (see `causeOptionKey`) of every answer checked in `causes`. */
export const checkedCauseKeys = (causes: readonly Cause[] = []) =>
  new Set(
    causes.flatMap((cause) => {
      const mainCauseLabel = cause.mainCauseLabel ?? ''
      return [
        ...(cause.mainCauseAnswers ?? []).map((answer) =>
          causeOptionKey({ mainCauseLabel, answer: answer.mainCauseAnswer ?? '' })
        ),
        ...(cause.subCauses ?? []).flatMap((subCause) =>
          (subCause.subCauseAnswers ?? []).map((answer) =>
            causeOptionKey({
              mainCauseLabel,
              subCauseLabel: subCause.subCauseLabel,
              answer: answer.subCauseAnswer ?? ''
            })
          )
        )
      ]
    })
  )

const checkAnswer = (causes: readonly Cause[], option: CauseOption): Cause[] => {
  const { mainCauseLabel, subCauseLabel, answer } = option
  const mainAnswer = { mainCauseAnswer: answer, levelOfDegradation: '' }
  const subAnswer = { subCauseAnswer: answer, levelOfDegradation: '' }

  if (!causes.some((cause) => cause.mainCauseLabel === mainCauseLabel)) {
    return [
      ...causes,
      subCauseLabel
        ? { mainCauseLabel, subCauses: [{ subCauseLabel, subCauseAnswers: [subAnswer] }] }
        : { mainCauseLabel, mainCauseAnswers: [mainAnswer] }
    ]
  }

  return causes.map((cause) => {
    if (cause.mainCauseLabel !== mainCauseLabel) return cause
    if (!subCauseLabel) {
      return { ...cause, mainCauseAnswers: [...(cause.mainCauseAnswers ?? []), mainAnswer] }
    }
    const subCauses = cause.subCauses ?? []
    if (!subCauses.some((subCause) => subCause.subCauseLabel === subCauseLabel)) {
      return {
        ...cause,
        subCauses: [...subCauses, { subCauseLabel, subCauseAnswers: [subAnswer] }]
      }
    }
    return {
      ...cause,
      subCauses: subCauses.map((subCause) =>
        subCause.subCauseLabel === subCauseLabel
          ? { ...subCause, subCauseAnswers: [...(subCause.subCauseAnswers ?? []), subAnswer] }
          : subCause
      )
    }
  })
}

const uncheckAnswer = (causes: readonly Cause[], option: CauseOption): Cause[] => {
  const { mainCauseLabel, subCauseLabel, answer } = option

  return causes.flatMap((cause) => {
    if (cause.mainCauseLabel !== mainCauseLabel) return [cause]

    const mainCauseAnswers = subCauseLabel
      ? cause.mainCauseAnswers
      : cause.mainCauseAnswers?.filter((a) => a.mainCauseAnswer !== answer)
    const subCauses = subCauseLabel
      ? cause.subCauses
          ?.map((subCause) =>
            subCause.subCauseLabel === subCauseLabel
              ? {
                  ...subCause,
                  subCauseAnswers: subCause.subCauseAnswers?.filter(
                    (a) => a.subCauseAnswer !== answer
                  )
                }
              : subCause
          )
          .filter((subCause) => subCause.subCauseAnswers?.length)
      : cause.subCauses

    // A main cause with nothing checked under it is dropped.
    if (!mainCauseAnswers?.length && !subCauses?.length) return []

    const next: Cause = { ...cause }
    if (mainCauseAnswers) next.mainCauseAnswers = mainCauseAnswers
    if (subCauses) next.subCauses = subCauses
    return [next]
  })
}

/** `causes` with `option` checked or unchecked. Levels of degradation already given are kept. */
export const toggleCause = (
  causes: readonly Cause[] = [],
  option: CauseOption,
  checked: boolean
): Cause[] => {
  const isChecked = checkedCauseKeys(causes).has(causeOptionKey(option))
  if (checked === isChecked) return [...causes]
  return checked ? checkAnswer(causes, option) : uncheckAnswer(causes, option)
}
