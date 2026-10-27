import type { MonitoringAnswer, RegistrationAnswer } from '@/types/api'

export const findRegistationDataItem = (
  registrationAnswers: RegistrationAnswer[] | undefined,
  questionId: string
) => registrationAnswers?.find((dataItem) => dataItem.question_id === questionId)?.answer_value

export const findMonitoringDataItem = (
  monitoringForm: { answers?: MonitoringAnswer[] } | undefined,
  questionId: string
) => monitoringForm?.answers?.find((dataItem) => dataItem.question_id === questionId)?.answer_value
