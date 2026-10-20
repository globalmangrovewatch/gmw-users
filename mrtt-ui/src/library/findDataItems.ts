import type { MonitoringAnswer, RegistrationAnswer } from '@/types/api'

type RegistrationAnswersResponse = { data: RegistrationAnswer[] }
type MonitoringFormResponse = { data?: { answers?: MonitoringAnswer[] } }

export const findRegistationDataItem = (
  registrationAnswersFromServer: RegistrationAnswersResponse | undefined,
  questionId: string
) =>
  registrationAnswersFromServer?.data.find((dataItem) => dataItem.question_id === questionId)
    ?.answer_value

export const findMonitoringDataItem = (
  registrationAnswersFromServer: MonitoringFormResponse | undefined,
  questionId: string
) =>
  registrationAnswersFromServer?.data?.answers?.find(
    (dataItem) => dataItem.question_id === questionId
  )?.answer_value
