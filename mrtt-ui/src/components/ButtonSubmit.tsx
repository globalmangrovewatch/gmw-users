import { Button, type ButtonProps } from '@/components/ui/button'
import language from '@/language'

type ButtonSubmitProps = Omit<ButtonProps, 'children' | 'type'> & {
  isSubmitting: boolean
}

/** A form's submit button; says "Submitting" and is disabled while the request runs. */
function ButtonSubmit({ isSubmitting, disabled, ...props }: ButtonSubmitProps) {
  return (
    <Button type='submit' disabled={isSubmitting || disabled} {...props}>
      {isSubmitting ? language.buttons.submitting : language.buttons.submit}
    </Button>
  )
}

export default ButtonSubmit
export type { ButtonSubmitProps }
