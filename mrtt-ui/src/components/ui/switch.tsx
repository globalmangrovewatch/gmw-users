'use client'

import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

/** On/off switch, 50×30, brand-800 when on. */
function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'inline-flex h-7.5 w-12.5 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none data-checked:bg-brand-800 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-unchecked:bg-black/25',
        className
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className='size-5.5 rounded-full bg-white shadow-sm transition-transform data-checked:translate-x-5'
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
