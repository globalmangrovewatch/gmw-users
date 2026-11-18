'use client'

import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger

type DropdownMenuContentProps = ComponentProps<typeof MenuPrimitive.Popup> &
  Pick<
    ComponentProps<typeof MenuPrimitive.Positioner>,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >

function DropdownMenuContent({
  className,
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className='z-50 outline-none'
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}>
        <MenuPrimitive.Popup
          data-slot='dropdown-menu-content'
          className={cn(
            'min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-md bg-white p-1 text-text shadow-md outline-none',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      data-slot='dropdown-menu-item'
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-brand-100 data-highlighted:text-brand-900',
        className
      )}
      {...props}
    />
  )
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger }
