import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

import formatApiAnswersForForm from './formatApiAnswersForForm'
import language from '../language'

const useInitializeQuestionMappedForm = ({ apiUrl, resetForm, setIsLoading, questionMapping }) => {
  useEffect(
    function initializeFormWithApiData() {
      if (resetForm && apiUrl) {
        axios
          .get(apiUrl)
          .then(({ data }) => {
            setIsLoading(false)
            const initialValuesForForm = formatApiAnswersForForm({
              apiAnswers: data,
              questionMapping
            })
            resetForm(initialValuesForForm)
          })
          .catch(() => {
            toast.error(language.error.apiLoad)
          })
      }
    },
    [apiUrl, resetForm, setIsLoading, questionMapping]
  )
}

export default useInitializeQuestionMappedForm
