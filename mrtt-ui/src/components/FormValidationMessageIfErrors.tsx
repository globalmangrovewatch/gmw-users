import type { ComponentProps } from 'react'
import type { FieldErrors } from 'react-hook-form'
import { LuCircleAlert } from 'react-icons/lu'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import language from '@/language'

type FormValidationMessageIfErrorsProps = Omit<
  ComponentProps<typeof Alert>,
  'children' | 'variant'
> & {
  formErrors?: FieldErrors | null
}

/** Banner shown above a form while any field has a validation error. */
function FormValidationMessageIfErrors({
  formErrors,
  ...props
}: FormValidationMessageIfErrorsProps) {
  const formHasErrors = !!formErrors && Object.keys(formErrors).length > 0
  if (!formHasErrors) return null

  return (
    <Alert role='alert' {...props} variant='destructive'>
      <LuCircleAlert aria-hidden='true' />
      <AlertTitle>{language.form.validationAlert.title}</AlertTitle>
      <AlertDescription>{language.form.validationAlert.description}</AlertDescription>
    </Alert>
  )
}

export default FormValidationMessageIfErrors
