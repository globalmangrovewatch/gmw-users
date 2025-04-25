import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-toastify'

import formatApiAnswersForForm from '../formatApiAnswersForForm'
import language from '../../language'

// type FormattedResponse = {
//   response: AxiosResponse
//   formattedData: any
// }

// type Params = {
//   apiUrl: string
//   questionMapping: any
//   resetForm: (values: any) => void
//   successCallback?: (response: AxiosResponse) => void
//   enabled?: boolean
// }

const queryOptions = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false
}
export function useInitializeQuestionMappedForm({
  apiUrl,
  questionMapping,
  // resetForm,
  successCallback,
  enabled = true
}) {
  return useQuery({
    queryKey: ['question-mapped-form', apiUrl],
    queryFn: async () => {
      const response = await axios.get(apiUrl)
      try {
        const formattedData = await formatApiAnswersForForm({
          apiAnswers: response.data,
          questionMapping
        })
        // resetForm(formattedData)
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
