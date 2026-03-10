import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query'
import axios from 'axios'

type MonitorFormKey =
  | 'managementStatusAndEffectiveness'
  | 'ecologicalStatusAndOutcomes'
  | 'socioeconomicGovernanceStatusAndOutcomes'

type MonitorsItem = {
  id: string
  form_type: MonitorFormKey
  monitoring_date: string
}

type Params<TSelected = MonitorsItem[]> = {
  key: MonitorFormKey
  siteId: string
  queryOptions?: Omit<
    UseQueryOptions<MonitorsItem[], Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

const queryOptionsDefault = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
} as const

export function useGetMonitorsForms<TSelected = MonitorsItem[]>({
  key,
  siteId,
  queryOptions
}: Params<TSelected>): UseQueryResult<TSelected, Error> {
  return useQuery<MonitorsItem[], Error, TSelected>({
    queryKey: ['question-mapped-form-monitors', key, siteId],
    queryFn: async (): Promise<MonitorsItem[]> => {
      const response = await axios.get<MonitorsItem[]>(
        `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
      )

      return response.data
    },
    ...queryOptionsDefault,
    ...queryOptions
  })
}
