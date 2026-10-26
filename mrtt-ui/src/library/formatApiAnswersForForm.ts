import { defaultValues } from '@/components/FormWrapper/FormSchemaValidation'
import type { RegistrationAnswer } from '@/types/api'

/** Section name to { form field: question id }, like `questionMapping`. */
export type SectionMappings = Record<string, Record<string, string>>

export type FormValuesBySection<M extends SectionMappings> = {
  [S in keyof M]: Record<keyof M[S], unknown>
}

const defaultValueFor = (fieldKey: string): unknown =>
  (defaultValues as Record<string, unknown>)[fieldKey]

export const formatApiAnswersForFormByKey = <M extends SectionMappings>({
  apiAnswers,
  questionMapping
}: {
  apiAnswers: RegistrationAnswer[]
  questionMapping: M
}): FormValuesBySection<M> => {
  const answersById = new Map(apiAnswers.map((a) => [a.question_id, a.answer_value]))

  const result: Record<string, Record<string, unknown>> = {}

  Object.entries(questionMapping).forEach(([sectionKey, sectionMapping]) => {
    const section: Record<string, unknown> = {}
    result[sectionKey] = section

    Object.entries(sectionMapping).forEach(([fieldKey, questionId]) => {
      let apiValue = answersById.get(questionId)

      // MUI specific: cast 'true'/'false' strings to boolean
      if (apiValue === 'true') apiValue = true
      if (apiValue === 'false') apiValue = false

      const hasValue =
        apiValue !== undefined &&
        apiValue !== null &&
        !(typeof apiValue === 'string' && apiValue.trim() === '')

      section[fieldKey] = hasValue ? apiValue : defaultValueFor(fieldKey)
    })
  })
  return result as FormValuesBySection<M>
}
