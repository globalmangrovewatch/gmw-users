import {
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseQueryOptions,
  useMutation
} from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useEffect, useRef } from 'react'

import { mapDataForApi } from '../../library/mapDataForApi'
import { formatApiAnswersForFormByKey } from '../formatApiAnswersForForm'
import { questionMapping } from '../../data/questionMapping'
import { FORM_NAMES_DICTIONARY_INTERVENTIONS } from '../../constants/sectionNames'
import { toast } from 'react-toastify'

import { UseFormReturn, Path } from 'react-hook-form'

type SectionTarget = 'interventions' | 'monitors'

type SaveRegistrationSectionParams<TFormValues extends Record<string, unknown>> = {
  siteId: string
  form: UseFormReturn<TFormValues>
  section: string
  sectionTarget: SectionTarget
  monitorId?: string
}

type MutationPayload = Record<string, unknown>

type ApiResponse = AxiosResponse<unknown>

type ApiAnswerItem = {
  question_id: string
  answer_value: unknown
}

export type FormattedResponse = {
  response: AxiosResponse<ApiAnswerItem[]>
  formattedData: Record<string, Record<string, unknown>>
}

type ApiAnswerMonitorsItem = {
  question_id: string
  monitoring_date: string
  answer_value: unknown
}

type ApiMonitorsFormResponse = {
  id: string
  form_type: string
  answers: ApiAnswerMonitorsItem[]
}

export type FormattedMonitorsResponse = {
  response: AxiosResponse<ApiMonitorsFormResponse>
  formattedData: Record<string, Record<string, unknown>>
}

type Params<TSelected = FormattedResponse> = {
  key: string
  apiUrl: string
  siteId?: string
  form: UseFormReturn
  questionMapping: unknown
  successCallback?: (
    response: AxiosResponse<ApiAnswerItem[]>,
    sectionData: Record<string, unknown>,
    allSectionsData: Record<string, Record<string, unknown>>
  ) => void
  enabled?: boolean
  queryOptions?: Omit<
    UseQueryOptions<FormattedResponse, Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

type ParamsMonitors<TSelected = FormattedMonitorsResponse> = Omit<
  Params,
  'successCallback' | 'queryOptions'
> & {
  successCallback?: (
    response: AxiosResponse<ApiMonitorsFormResponse>,
    sectionData: Record<string, unknown>,
    allSectionsData: Record<string, Record<string, unknown>>
  ) => void
  queryOptions?: Omit<
    UseQueryOptions<FormattedMonitorsResponse, Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

const queryOptionsDefault = {
  refetchOnMount: false,
  staleTime: Infinity
} as const

export function useInitializeQuestionMappedForm<TSelected = FormattedResponse>({
  key,
  apiUrl,
  siteId,
  form,
  questionMapping,
  successCallback,
  enabled = true,
  queryOptions
}: Params<TSelected>): UseQueryResult<TSelected, Error> {
  const lastPopulatedAt = useRef(0)

  const query = useQuery<FormattedResponse, Error, TSelected>({
    queryKey: ['question-mapped-form', key, apiUrl, siteId],
    enabled: Boolean(enabled && key && apiUrl && !apiUrl.includes('undefined')),
    queryFn: async (): Promise<FormattedResponse> => {
      const response = await axios.get<ApiAnswerItem[]>(apiUrl)

      const formattedData = formatApiAnswersForFormByKey({
        apiAnswers: response.data,
        questionMapping
      }) as Record<string, Record<string, unknown>>

      return { response, formattedData }
    },
    ...queryOptionsDefault,
    ...queryOptions
  })

  useEffect(() => {
    if (!query.data || query.dataUpdatedAt === lastPopulatedAt.current) return
    lastPopulatedAt.current = query.dataUpdatedAt

    const data = query.data as unknown as FormattedResponse
    const sectionData = data.formattedData[key] ?? {}
    Object.entries(sectionData).forEach(([fieldKey, value]) => {
      form.setValue(fieldKey, value, { shouldDirty: false })
    })

    successCallback?.(data.response, sectionData, data.formattedData)
  }, [query.data, query.dataUpdatedAt]) // eslint-disable-line react-hooks/exhaustive-deps

  return query
}

export function useInitializeQuestionMappedFormMonitors<TSelected = FormattedMonitorsResponse>({
  key,
  apiUrl,
  siteId,
  form,
  questionMapping,
  successCallback,
  enabled = true,
  queryOptions
}: ParamsMonitors<TSelected>): UseQueryResult<TSelected, Error> {
  const lastPopulatedAt = useRef(0)
  const isQueryEnabled =
    Boolean(enabled) && Boolean(key) && Boolean(apiUrl) && !apiUrl.includes('undefined')

  const query = useQuery<FormattedMonitorsResponse, Error, TSelected>({
    queryKey: ['question-mapped-form-monitors', key, apiUrl, siteId],
    enabled: isQueryEnabled,
    queryFn: async (): Promise<FormattedMonitorsResponse> => {
      const response = await axios.get<ApiMonitorsFormResponse>(apiUrl)
      const formattedData = formatApiAnswersForFormByKey({
        apiAnswers: response.data.answers,
        questionMapping
      }) as Record<string, Record<string, unknown>>

      return { response, formattedData }
    },
    ...queryOptionsDefault,
    ...queryOptions
  })

  useEffect(() => {
    if (!query.data || query.dataUpdatedAt === lastPopulatedAt.current) return
    lastPopulatedAt.current = query.dataUpdatedAt

    const data = query.data as unknown as FormattedMonitorsResponse
    const sectionData = data.formattedData[key] ?? {}
    Object.entries(sectionData).forEach(([fieldKey, value]) => {
      form.setValue(fieldKey, value, { shouldDirty: false })
    })

    successCallback?.(data.response, sectionData, data.formattedData)
  }, [query.data, query.dataUpdatedAt]) // eslint-disable-line react-hooks/exhaustive-deps

  return query
}

export function useSaveRegistrationSection<
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>({ siteId, form, section, sectionTarget, monitorId }: SaveRegistrationSectionParams<TFormValues>) {
  const queryClient = useQueryClient()
  const apiUrl: Record<SectionTarget, string> = {
    interventions: `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`,
    monitors: `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers${
      monitorId ? `/${monitorId}` : ''
    }`
  }

  const mutation = useMutation<ApiResponse, Error, MutationPayload>({
    mutationKey: ['save-registration-section', siteId, section],
    mutationFn: async (formData) => {
      if (!siteId) throw new Error('Missing siteId')

      const payload = mapDataForApi(section, formData, sectionTarget)

      if (sectionTarget === 'interventions') {
        return axios.patch(apiUrl.interventions, payload)
      }

      if (sectionTarget === 'monitors' && monitorId) {
        return axios.put(`${apiUrl.monitors}`, payload)
      }

      return axios.post(apiUrl.monitors, payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['question-mapped-form'] })
      await queryClient.invalidateQueries({ queryKey: ['question-mapped-form-monitors'] })
    }
  })

  const save = async (currentSection: string): Promise<boolean> => {
    const fields = Object.keys(questionMapping[currentSection] ?? {}) as Array<keyof TFormValues>

    const ok = await form.trigger(fields as Path<TFormValues>[], { shouldFocus: true })

    if (!ok) {
      toast.error(
        `Cannot save "${
          FORM_NAMES_DICTIONARY_INTERVENTIONS[currentSection] || currentSection
        }". Please fix the errors indicated on the form.`
      )
      return false
    }

    const all = form.getValues()

    const sectionValues = Object.fromEntries(
      fields.map((key) => [key, all[key]])
    ) as MutationPayload

    await mutation.mutateAsync(sectionValues)

    return true
  }

  return { save, mutation }
}
