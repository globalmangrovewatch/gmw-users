import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

import { useMutation } from '@tanstack/react-query'

import { mapDataForApi } from '../../library/mapDataForApi'

import { formatApiAnswersForFormByKey } from '../formatApiAnswersForForm'
import { questionMapping } from '../../data/questionMapping'
import { useParams } from 'react-router-dom'
import { defaultValues } from '../../components/FormWrapper/FormSchemaValidation'
import { SECTION_NAMES_DICTIONARY } from '../../constants/sectionNames'

type ApiAnswerItem = {
  question_id: string
  answer_value: unknown
}

export type FormattedResponse = {
  response: AxiosResponse<ApiAnswerItem[]>
  formattedData: unknown
}

type Params<TSelected = FormattedResponse> = {
  key: 'projectDetails' | 'siteBackground'
  apiUrl: string
  questionMapping: unknown
  resetForm: (values: unknown) => void
  successCallback?: (response: AxiosResponse<ApiAnswerItem[]>) => void
  enabled?: boolean
  queryOptions?: Omit<
    UseQueryOptions<FormattedResponse, Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

type ApiAnswer = { question_id: string; answer_value: any }

const queryOptionsDefault = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
} as const

export function useInitializeQuestionMappedForm<TSelected = FormattedResponse>({
  key,
  apiUrl,
  resetForm,
  questionMapping,
  successCallback,
  enabled = true,
  queryOptions = queryOptionsDefault
}: Params<TSelected>): UseQueryResult<TSelected, Error> {
  return useQuery<FormattedResponse, Error, TSelected>({
    queryKey: ['question-mapped-form', key, apiUrl],
    enabled: Boolean(enabled && key && apiUrl && !apiUrl.includes('undefined')),
    ...(queryOptionsDefault as any),
    ...(queryOptions ?? {}),
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

    ...(queryOptionsDefault as Omit<
      UseQueryOptions<FormattedResponse, Error, TSelected, readonly unknown[]>,
      'queryKey' | 'queryFn' | 'enabled'
    >),
    ...(queryOptions ?? {})
  })
}

export function useSaveRegistrationSection({
  siteId,
  form,
  section
}: {
  siteId: string
  form: any
  section: string
}) {
  const apiUrl = `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`

  const mutation = useMutation({
    mutationKey: ['save-registration-section', siteId, section],
    mutationFn: async ({ formData }: { formData: any }) => {
      if (!siteId) throw new Error('Missing siteId')
      return axios.patch(apiUrl, mapDataForApi(section, formData))
    }
  })

  const save = async (section: string) => {
    const fields = Object.keys(questionMapping[section] ?? {})
    const ok = await form.trigger(fields, { shouldFocus: true })
    if (!ok) return false

    const all = form.getValues()
    const sectionValues = Object.fromEntries(fields.map((k) => [k, all[k]]))
    await mutation.mutateAsync({ formData: sectionValues })
    return true
  }

  return { save, mutation }
}
