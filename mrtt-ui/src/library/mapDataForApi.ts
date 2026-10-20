import type { SectionTarget } from '@/constants/sectionNames'
import { isSectionKey, questionMapping } from '@/data/questionMapping'
import type { RegistrationAnswer } from '@/types/api'

export type MonitoringPayload = { form_type: string; answers: RegistrationAnswer[] }

// set up data structure for api using question_id and answer_value object
// ensure formTitle is the same is title in questionMapping
export function mapDataForApi(
  formTitle: string,
  data: Record<string, unknown>,
  sectionTarget: 'monitors'
): MonitoringPayload
export function mapDataForApi(
  formTitle: string,
  data: Record<string, unknown>,
  sectionTarget?: 'interventions'
): RegistrationAnswer[]
export function mapDataForApi(
  formTitle: string,
  data: Record<string, unknown>,
  sectionTarget?: SectionTarget
): RegistrationAnswer[] | MonitoringPayload
export function mapDataForApi(
  formTitle: string,
  data: Record<string, unknown>,
  sectionTarget?: SectionTarget
): RegistrationAnswer[] | MonitoringPayload {
  const sectionMapping: Record<string, string> | undefined = isSectionKey(formTitle)
    ? questionMapping[formTitle]
    : undefined
  const preppedData: RegistrationAnswer[] = []

  for (const [fieldName, uiAnswer] of Object.entries(data)) {
    const apiQuestionId = sectionMapping?.[fieldName]

    if (apiQuestionId) {
      preppedData.push({
        question_id: apiQuestionId,
        answer_value: uiAnswer
      })
    }
  }
  if (sectionTarget === 'monitors') {
    return {
      form_type: formTitle,
      answers: preppedData
    }
  }

  return preppedData
}
