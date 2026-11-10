import type { ComponentProps } from 'react'

import language from '@/language'
import { cn } from '@/lib/cn'

function RequiredIndicator({ className, ...props }: Omit<ComponentProps<'span'>, 'children'>) {
  return (
    <span
      aria-label={language.form.requiredIndicator}
      className={cn('px-1.25 text-danger', className)}
      {...props}>
      *
    </span>
  )
}

export default RequiredIndicator
