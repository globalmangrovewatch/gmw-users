import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type LabelProps = ComponentProps<'label'> & {
  required?: boolean
}

// Base UI has no standalone Label primitive: a native <label> with htmlFor is enough.
function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      data-slot='label'
      className={cn(
        'text-sm leading-none font-semibold transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}>
      <span className='inline-flex items-center gap-1'>
        {children}
        {required && (
          <span aria-hidden='true' className='text-danger'>
            *
          </span>
        )}
      </span>
    </label>
  )
}

export { Label }
export type { LabelProps }
