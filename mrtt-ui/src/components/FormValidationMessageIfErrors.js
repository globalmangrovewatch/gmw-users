import { Alert, AlertTitle } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { questionMapping } from '../data/questionMapping'

import language from '../language'

export function getSectionsWithErrors(questionMapping, errors) {
  const sections = new Set()

  for (const fields of Object.values(questionMapping)) {
    for (const [fieldName, questionId] of Object.entries(fields)) {
      if (errors[fieldName]) {
        sections.add(questionId)
      }
    }
  }

  if (sections.size === 0) return ''

  return `Please note the sections with errors are ${Array.from(sections).join(', ')}.`
}

const FormValidationMessageIfErrors = ({ formErrors = {} }) => {
  const formHasErrors = !!Object.keys(formErrors).length

  const sectionsWithErrors = getSectionsWithErrors(questionMapping, formErrors)

  useEffect(() => {
    if (formHasErrors) {
      toast.warn(
        `${language.form.validationAlert.title}. ${language.form.validationAlert.description}`
      )
    }
  }, [formHasErrors])

  return formHasErrors ? (
    <Alert variant='outlined' severity='error'>
      <AlertTitle>{language.form.validationAlert.title}</AlertTitle>
      <p>{language.form.validationAlert.description}</p>
      {sectionsWithErrors && <p>{sectionsWithErrors}</p>}
    </Alert>
  ) : null
}

FormValidationMessageIfErrors.propTypes = { formErrors: PropTypes.shape({}) }

export default FormValidationMessageIfErrors
