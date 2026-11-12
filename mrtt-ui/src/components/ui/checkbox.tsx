'use client'

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import type { ComponentProps } from 'react'
import { LuCheck } from 'react-icons/lu'

import { cn } from '@/lib/cn'

function CheckboxIndicator({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Indicator>) {
  return (
    <CheckboxPrimitive.Indicator
      data-slot='checkbox-indicator'
      className={cn('flex items-center justify-center', className)}
      {...props}
    />
  )
}

function Checkbox({
  className,
  children,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        'inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 border-brand-800/50 bg-white text-white focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none data-checked:border-brand-800 data-checked:bg-brand-800 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}>
      {children ?? (
        <CheckboxIndicator>
          <LuCheck className='size-3.5' strokeWidth={3} aria-hidden='true' />
        </CheckboxIndicator>
      )}
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, CheckboxIndicator }
