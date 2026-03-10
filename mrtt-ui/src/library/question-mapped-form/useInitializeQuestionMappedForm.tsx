import { useQuery, UseQueryResult, UseQueryOptions, useMutation } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

import { mapDataForApi } from '../../library/mapDataForApi'
import { formatApiAnswersForFormByKey } from '../formatApiAnswersForForm'
import { questionMapping } from '../../data/questionMapping'
import { defaultValues } from '../../components/FormWrapper/FormSchemaValidation'
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
  formattedData: unknown
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
  formattedData: unknown
}

type Params<TSelected = FormattedResponse> = {
  key: 'projectDetails' | 'siteBackground'
  apiUrl: string
  siteId: string
  targetKey: 'interventions' | 'monitors'
  questionMapping: unknown
  resetForm: (values: unknown) => void
  successCallback?: (response: AxiosResponse<ApiAnswerItem[]>) => void
  enabled?: boolean
  queryOptions?: Omit<
    UseQueryOptions<FormattedResponse, Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

type ParamsMonitors<TSelected = FormattedMonitorsResponse> = Omit<
  Params<any>,
  'successCallback' | 'queryOptions'
> & {
  successCallback?: (response: AxiosResponse<ApiMonitorsFormResponse>) => void
  queryOptions?: Omit<
    UseQueryOptions<FormattedMonitorsResponse, Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

const queryOptionsDefault = {
  refetchOnMount: 'always',
  staleTime: 0
} as const

export function useInitializeQuestionMappedForm<TSelected = FormattedResponse>({
  key,
  apiUrl,
  siteId,
  resetForm,
  questionMapping,
  successCallback,
  enabled = true,
  queryOptions
}: Params<TSelected>): UseQueryResult<TSelected, Error> {
  return useQuery<FormattedResponse, Error, TSelected>({
    queryKey: ['question-mapped-form', key, apiUrl, siteId],
    enabled: Boolean(enabled && key && apiUrl && !apiUrl.includes('undefined')),
    queryFn: async (): Promise<FormattedResponse> => {
      const response = await axios.get<ApiAnswerItem[]>(apiUrl)

      const formattedData = await formatApiAnswersForFormByKey({
        apiAnswers: response.data,
        questionMapping
      })

      resetForm({
        ...defaultValues,
        ...formattedData[key]
      })

      successCallback?.(response)

      return { response, formattedData }
    },
    ...queryOptionsDefault,
    ...queryOptions
  })
}

export function useInitializeQuestionMappedFormMonitors<TSelected = FormattedMonitorsResponse>({
  key,
  apiUrl,
  siteId,
  resetForm,
  questionMapping,
  successCallback,
  enabled = true,
  queryOptions
}: ParamsMonitors<TSelected>): UseQueryResult<TSelected, Error> {
  const isQueryEnabled =
    Boolean(enabled) && Boolean(key) && Boolean(apiUrl) && !apiUrl.includes('undefined')

  return useQuery<FormattedMonitorsResponse, Error, TSelected>({
    queryKey: ['question-mapped-form-monitors', key, apiUrl, siteId],
    enabled: isQueryEnabled,
    queryFn: async (): Promise<FormattedMonitorsResponse> => {
      const response = await axios.get<ApiMonitorsFormResponse>(apiUrl)
      const formattedData = await formatApiAnswersForFormByKey({
        apiAnswers: response.data.answers,
        questionMapping
      })

      resetForm({
        ...defaultValues,
        ...formattedData[key]
      })

      successCallback?.(response)

      return { response, formattedData }
    },
    ...queryOptionsDefault,
    ...queryOptions
  })
}

export function useSaveRegistrationSection<
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>({ siteId, form, section, sectionTarget, monitorId }: SaveRegistrationSectionParams<TFormValues>) {
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
