'use client'

import { Command as CommandPrimitive } from 'cmdk'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot='command'
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-text',
        className
      )}
      {...props}
    />
  )
}

function CommandInput({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot='command-input-wrapper' className='flex items-center p-0.5'>
      <CommandPrimitive.Input
        data-slot='command-input'
        className={cn(
          'flex h-10 w-full rounded-md border-2 border-black/15 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-black/60 focus:border-brand-800 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot='command-list'
      className={cn('max-h-72 overflow-x-hidden overflow-y-auto', className)}
      {...props}
    />
  )
}

function CommandEmpty({ className, ...props }: ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot='command-empty'
      className={cn('py-6 text-center text-sm', className)}
      {...props}
    />
  )
}

function CommandGroup({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot='command-group'
      className={cn(
        'overflow-hidden p-1 text-text **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-black/60',
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot='command-separator'
      className={cn('-mx-1 h-px bg-black/15', className)}
      {...props}
    />
  )
}

function CommandItem({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot='command-item'
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-brand-100 data-[selected=true]:text-brand-900',
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
}
