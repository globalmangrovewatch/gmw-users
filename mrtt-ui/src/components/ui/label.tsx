'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type LabelProps = ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean
}

function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
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
    </LabelPrimitive.Root>
  )
}

export { Label }
