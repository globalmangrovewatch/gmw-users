import { LuCircleAlert } from 'react-icons/lu'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import language from '@/language'

type FormValidationMessageIfErrorsProps = {
  formErrors?: Record<string, unknown> | null
}

/** Banner shown above a form while any field has a validation error. */
function FormValidationMessageIfErrors({ formErrors }: FormValidationMessageIfErrorsProps) {
  const formHasErrors = !!formErrors && Object.keys(formErrors).length > 0
  if (!formHasErrors) return null

  return (
    <Alert variant='destructive' role='alert'>
      <LuCircleAlert aria-hidden='true' />
      <AlertTitle>{language.form.validationAlert.title}</AlertTitle>
      <AlertDescription>{language.form.validationAlert.description}</AlertDescription>
    </Alert>
  )
}

export default FormValidationMessageIfErrors
