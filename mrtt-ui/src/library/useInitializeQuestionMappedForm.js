import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

import formatApiAnswersForForm from './formatApiAnswersForForm'
import language from '../language'

const useInitializeQuestionMappedForm = ({
  apiUrl,
  resetForm,
  setIsLoading,
  questionMapping,
  successCallback,
  secondSuccessCallback,
  thirdSuccessCallback
}) => {
  useEffect(
    function initializeFormWithApiData() {
      if (resetForm && apiUrl) {
        setIsLoading(true)
        axios
          .get(apiUrl)
          .then((response) => {
            setIsLoading(false)
            const initialValuesForForm = formatApiAnswersForForm({
              apiAnswers: response.data,
              questionMapping
            })
            resetForm(initialValuesForForm)
            if (successCallback) {
              successCallback(response)
            }
            if (secondSuccessCallback) {
              secondSuccessCallback(response)
            }
            if (thirdSuccessCallback) {
              thirdSuccessCallback(response)
            }
          })
          .catch(() => {
            setIsLoading(false)
            toast.error(language.error.apiLoad)
          })
      }
    },
    [
      apiUrl,
      resetForm,
      setIsLoading,
      questionMapping,
      successCallback,
      secondSuccessCallback,
      thirdSuccessCallback
    ]
  )
}

export default useInitializeQuestionMappedForm
