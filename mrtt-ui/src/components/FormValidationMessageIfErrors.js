import { Alert, AlertTitle } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { questionMapping } from '../data/questionMapping'

import language from '../language'

const FormValidationMessageIfErrors = ({ formErrors = {} }) => {
  const formHasErrors = !!Object.keys(formErrors).length

  return formHasErrors ? (
    <Alert variant='outlined' severity='error'>
      <AlertTitle>{language.form.validationAlert.title}</AlertTitle>
      <p>{language.form.validationAlert.description}</p>
    </Alert>
  ) : null
}

FormValidationMessageIfErrors.propTypes = { formErrors: PropTypes.shape({}) }

export default FormValidationMessageIfErrors
