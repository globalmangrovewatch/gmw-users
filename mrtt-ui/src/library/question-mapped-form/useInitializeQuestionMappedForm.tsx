import { useQuery, UseQueryResult, UseQueryOptions } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'

import { useMutation } from '@tanstack/react-query'

import { mapDataForApi } from '../../library/mapDataForApi'

import { formatApiAnswersForFormByKey } from '../formatApiAnswersForForm'
import { questionMapping } from '../../data/questionMapping'

import { defaultValues } from '../../components/FormWrapper/FormSchemaValidation'
import { FORM_NAMES_DICTIONARY_INTERVENTIONS } from '../../constants/sectionNames'
import { toast } from 'react-toastify'
import { de } from 'date-fns/locale'

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
  siteId: string
  questionMapping: unknown
  resetForm: (values: unknown) => void
  successCallback?: (response: AxiosResponse<ApiAnswerItem[]>) => void
  enabled?: boolean
  queryOptions?: Omit<
    UseQueryOptions<FormattedResponse, Error, TSelected, readonly unknown[]>,
    'queryKey' | 'queryFn' | 'enabled'
  >
}

const queryOptionsDefault = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
} as const

export function useInitializeQuestionMappedForm<TSelected = FormattedResponse>({
  key,
  apiUrl,
  siteId,
  resetForm,
  questionMapping,
  successCallback,
  enabled = true,
  queryOptions = queryOptionsDefault
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
  section,
  sectionTarget
}: {
  siteId: string
  form: any
  section: string
  sectionTarget: 'interventions' | 'monitors'
}) {
  const apiUrl = {
    interventions: `${process.env.REACT_APP_API_URL}/sites/${siteId}/registration_intervention_answers`,
    monitors: `${process.env.REACT_APP_API_URL}/sites/${siteId}/monitoring_answers`
  }

  const mutation = useMutation({
    mutationKey: ['save-registration-section', siteId, section],
    mutationFn: async ({ formData }: { formData: any }) => {
      if (!siteId) throw new Error('Missing siteId')
      return axios.patch(apiUrl[sectionTarget], mapDataForApi(section, formData))
    }
  })

  const save = async (section: string) => {
    const fields = Object.keys(questionMapping[section] ?? {})
    const ok = await form.trigger(fields, { shouldFocus: true })
    if (!ok) {
      toast.error(
        `Cannot save "${
          FORM_NAMES_DICTIONARY_INTERVENTIONS[section] || section
        }". Please fix the errors indicated on the form.`
      )
      return false
    }

    const all = form.getValues()
    const sectionValues = Object.fromEntries(fields.map((k) => [k, all[k]]))
    await mutation.mutateAsync({ formData: sectionValues })
    return true
  }

  return { save, mutation }
}
