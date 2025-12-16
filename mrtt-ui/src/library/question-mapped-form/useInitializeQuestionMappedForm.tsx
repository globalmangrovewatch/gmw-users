import { useQuery, UseQueryResult } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

import formatApiAnswersForForm from '../formatApiAnswersForForm'
import language from '../../language'

type FormattedResponse = {
  response: AxiosResponse
  formattedData: unknown
}

type Params = {
  apiUrl: string
  questionMapping: unknown
  resetForm: (values: unknown) => void
  successCallback?: (response: AxiosResponse) => void
  enabled?: boolean
}

const queryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
}

export function useInitializeQuestionMappedForm({
  apiUrl,
  questionMapping,
  successCallback,
  enabled = true
}: Params): UseQueryResult<FormattedResponse, Error> {
  return useQuery<FormattedResponse, Error>({
    queryKey: ['question-mapped-form', apiUrl],
    queryFn: async () => {
      const response = await axios.get(apiUrl)
      try {
        const formattedData = await formatApiAnswersForForm({
          apiAnswers: response.data,
          questionMapping
        })
        successCallback?.(response)
        return { response: response.data, formattedData }
      } catch (error) {
        toast.error(language.error.apiLoad)
        console.error('Error formatting API answers:', error)
        throw error
      }
    },
    ...queryOptions,
    enabled: !!apiUrl && enabled
  })
}
