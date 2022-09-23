import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

import formatApiAnswersForForm from './formatApiAnswersForForm'
import language from '../language'

const useInitializeMonitoringForm = ({
  apiUrl,
  questionMapping,
  resetForm,
  setIsLoading,
  isEditMode = false
}) => {
  useEffect(
    function initializeFormWithApiData() {
      if (resetForm && apiUrl && isEditMode) {
        setIsLoading(true)
        axios
          .get(apiUrl)
          .then((response) => {
            setIsLoading(false)
            const initialValuesForForm = formatApiAnswersForForm({
              apiAnswers: response.data.answers,
              questionMapping
            })
            resetForm(initialValuesForForm)
          })
          .catch(() => {
            setIsLoading(false)
            toast.error(language.error.apiLoad)
          })
      }
    },
    [apiUrl, isEditMode, questionMapping, resetForm, setIsLoading]
  )
}

export default useInitializeMonitoringForm
