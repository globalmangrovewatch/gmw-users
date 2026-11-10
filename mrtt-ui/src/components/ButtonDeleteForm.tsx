import ButtonSecondaryWithLoader from '@/components/ButtonSecondaryWithLoader'
import type { ButtonProps } from '@/components/ui/button'
import language from '@/language'
import { cn } from '@/lib/cn'

type ButtonDeleteFormProps = Omit<ButtonProps, 'children'> & {
  isDeleting?: boolean
}

function ButtonDeleteForm({ isDeleting = false, className, ...props }: ButtonDeleteFormProps) {
  return (
    <ButtonSecondaryWithLoader
      variant='destructive'
      className={cn('mt-3.75', className)}
      isHolding={isDeleting}
      holdingContent={language.buttons.deleting}
      {...props}>
      {language.form.deleteForm}
    </ButtonSecondaryWithLoader>
  )
}

export default ButtonDeleteForm
