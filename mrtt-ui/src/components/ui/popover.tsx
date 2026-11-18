'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverClose = PopoverPrimitive.Close

type PopoverContentProps = ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    ComponentProps<typeof PopoverPrimitive.Positioner>,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'anchor'
  >

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  anchor,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        className='z-50'
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        anchor={anchor}>
        <PopoverPrimitive.Popup
          data-slot='popover-content'
          // className goes last so consumers can override defaults (e.g. width).
          className={cn(
            'w-fit origin-(--transform-origin) space-y-2 overflow-y-auto rounded-3xl bg-white p-4 text-sm text-text shadow-md outline-none',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverClose, PopoverContent, PopoverTrigger }
