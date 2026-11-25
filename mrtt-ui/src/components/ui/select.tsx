'use client'

import { Select as SelectPrimitive } from '@base-ui/react/select'
import type { ComponentProps, ReactNode } from 'react'
import { LuCheck, LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { MdArrowDropDown } from 'react-icons/md'

import { fieldClassName, fieldFocusClassName } from '@/components/ui/input'
import { cn } from '@/lib/cn'

/** Pass `items` ({ label, value }[]) so <SelectValue> shows the label instead of the raw value. */
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group

function SelectValue({ className, ...props }: ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot='select-value'
      className={cn('line-clamp-1 data-placeholder:text-black/60', className)}
      {...props}
    />
  )
}

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** Replaces the default drop-down arrow. */
  icon?: ReactNode
}

function SelectTrigger({ className, children, icon, ...props }: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      className={cn(
        fieldClassName,
        fieldFocusClassName,
        'flex h-14 cursor-pointer items-center justify-between gap-2 pr-2 pl-3.5 text-left whitespace-nowrap data-disabled:cursor-not-allowed data-disabled:opacity-50 data-popup-open:border-brand-800 data-popup-open:shadow-[inset_0_0_0_1px_var(--color-brand-800)]',
        className
      )}
      {...props}>
      {children}
      <SelectPrimitive.Icon className='flex'>
        {icon ?? <MdArrowDropDown className='size-6 shrink-0 text-black/54' aria-hidden='true' />}
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps = ComponentProps<typeof SelectPrimitive.Popup> &
  Pick<
    ComponentProps<typeof SelectPrimitive.Positioner>,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  >

function SelectContent({
  className,
  children,
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  // Open below the trigger like a dropdown, not over it (macOS-style).
  alignItemWithTrigger = false,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        className='z-50 outline-none select-none'
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        alignItemWithTrigger={alignItemWithTrigger}>
        <SelectPrimitive.Popup
          data-slot='select-content'
          className={cn(
            'relative min-w-(--anchor-width) origin-(--transform-origin) overflow-hidden rounded-md border border-black/15 bg-white text-text shadow-md outline-none',
            'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
          )}
          {...props}>
          <SelectPrimitive.ScrollUpArrow className='top-0 z-10 flex w-full cursor-default items-center justify-center bg-white py-1'>
            <LuChevronUp className='size-4 shrink-0' aria-hidden='true' />
          </SelectPrimitive.ScrollUpArrow>
          <SelectPrimitive.List className='max-h-(--available-height) scroll-my-1 overflow-y-auto p-1'>
            {children}
          </SelectPrimitive.List>
          <SelectPrimitive.ScrollDownArrow className='bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-white py-1'>
            <LuChevronDown className='size-4 shrink-0' aria-hidden='true' />
          </SelectPrimitive.ScrollDownArrow>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
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
        'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-brand-100 data-highlighted:text-brand-900',
        className
      )}
      {...props}>
      <span className='absolute right-2 flex size-3.5 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <LuCheck className='size-4 text-brand-800 shrink-0' aria-hidden='true' />
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
