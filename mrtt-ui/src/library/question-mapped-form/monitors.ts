import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query'
import axios from 'axios'

type MonitorFormKey =
  | 'managementStatusAndEffectiveness'
  | 'ecologicalStatusAndOutcomes'
  | 'socioeconomicGovernanceStatusAndOutcomes'

type ApiAnswerMonitorsItem = {
  id: string
  form_type: MonitorFormKey
  monitoring_date: string
}

type Params<TSelected = ApiAnswerMonitorsItem[]> = {
  key: MonitorFormKey
  siteId: string
  queryOptions?: Omit<
    UseQueryOptions<ApiAnswerMonitorsItem[], Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

const queryOptionsDefault = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
} as const

export function useGetMonitorForm<TSelected = ApiAnswerMonitorsItem[]>({
  key,
  siteId,
  queryOptions
}: Params<TSelected>): UseQueryResult<TSelected, Error> {
  return useQuery<ApiAnswerMonitorsItem[], Error, TSelected>({
    queryKey: ['question-mapped-form-monitors', key, siteId],
    queryFn: async (): Promise<ApiAnswerMonitorsItem[]> => {
      const response = await axios.get<ApiAnswerMonitorsItem[]>(
        `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
      )

      return response.data
    },
    ...queryOptionsDefault,
    ...queryOptions
  })
}
