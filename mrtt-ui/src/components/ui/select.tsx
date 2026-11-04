'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import type { ComponentProps } from 'react'
import { LuCheck, LuChevronDown, LuChevronUp } from 'react-icons/lu'

import { cn } from '@/lib/cn'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      className={cn(
        'flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-3xl border border-black/15 bg-transparent px-3 py-2 text-left text-sm whitespace-nowrap text-text ring-offset-white focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error data-placeholder:text-black/60 *:data-[slot=select-value]:line-clamp-1',
        className
      )}
      {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <LuChevronDown className='size-4 shrink-0 opacity-60' aria-hidden='true' />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        position={position}
        className={cn(
          'relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-black/15 bg-white text-text shadow-md',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        {...props}>
        <SelectPrimitive.ScrollUpButton className='flex cursor-default items-center justify-center py-1'>
          <LuChevronUp className='size-4' aria-hidden='true' />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1'
          )}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className='flex cursor-default items-center justify-center py-1'>
          <LuChevronDown className='size-4' aria-hidden='true' />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('px-2 py-1.5 text-xs text-black/60', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:bg-brand-100 focus:text-brand-900 data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}>
      <span className='absolute right-2 flex size-3.5 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <LuCheck className='size-4 text-brand-800' aria-hidden='true' />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-black/15', className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
}
