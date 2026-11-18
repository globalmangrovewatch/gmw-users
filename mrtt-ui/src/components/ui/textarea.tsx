import type { ComponentProps } from 'react'

import { fieldClassName, fieldFocusClassName } from '@/components/ui/input'
import { cn } from '@/lib/cn'

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        fieldClassName,
        fieldFocusClassName,
        'flex min-h-14 px-3.5 py-4 placeholder:text-black/60 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
