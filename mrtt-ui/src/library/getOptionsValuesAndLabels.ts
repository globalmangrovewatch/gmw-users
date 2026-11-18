export type Option<T extends string = string> = { label: T; value: T }

const getOptionsValuesAndLabels = <T extends string>(answers: readonly T[]): Option<T>[] =>
  answers.map((answer) => ({
    label: answer,
    value: answer
  }))

export default getOptionsValuesAndLabels
