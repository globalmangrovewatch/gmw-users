import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

import formatApiAnswersForForm from './formatApiAnswersForForm'
import language from '../language'

const useInitializeMonitoringForm = ({
  apiUrl,
  formType,
  isEditMode = false,
  questionMapping,
  resetForm,
  setIsLoading
}) => {
  useEffect(
    function initializeFormWithApiData() {
      if (resetForm && apiUrl && isEditMode) {
        setIsLoading(true)
        axios
          .get(apiUrl)
          .then(({ data }) => {
            setIsLoading(false)
            const formTypeInResponse = data.form_type
            if (formType !== formTypeInResponse) {
              throw new Error(
                'Monitoring data is being accessed with the wrong form component for the form type'
              )
            }

            const initialValuesForForm = formatApiAnswersForForm({
              apiAnswers: data.answers,
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
    [apiUrl, isEditMode, questionMapping, resetForm, setIsLoading, formType]
  )
}

export default useInitializeMonitoringForm
