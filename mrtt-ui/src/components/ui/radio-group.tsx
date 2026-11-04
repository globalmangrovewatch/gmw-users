'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

type RadioOption<T extends string = string> = {
  label: string
  value: T
}

type RadioGroupItemProps = Omit<ComponentProps<typeof RadioGroupPrimitive.Item>, 'value'> & {
  option: RadioOption
  labelClassName?: string
  /** Show the option label next to the dot. When false it becomes the aria-label. */
  label?: boolean
}

function RadioGroupItem({
  option,
  className,
  labelClassName,
  label = true,
  id,
  ...props
}: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot='radio-group-item'
      value={option.value}
      id={id}
      aria-label={label ? undefined : option.label}
      className={cn(
        'group flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}>
      <span
        aria-hidden='true'
        className='flex size-4 shrink-0 items-center justify-center rounded-full border border-text group-data-[state=checked]:border-brand-800'>
        <RadioGroupPrimitive.Indicator className='size-2 rounded-full bg-brand-800' />
      </span>
      {label && (
        <span className={cn('text-sm leading-none text-text', labelClassName)}>{option.label}</span>
      )}
    </RadioGroupPrimitive.Item>
  )
}

type RadioGroupProps = ComponentProps<typeof RadioGroupPrimitive.Root> & {
  /** Render one item per option. Pass children instead for a custom layout. */
  options?: RadioOption[]
}

function RadioGroup({ options, children, className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      data-slot='radio-group'
      className={cn('flex flex-col gap-2', className)}
      {...props}>
      {options
        ? options.map((option) => <RadioGroupItem key={option.value} option={option} />)
        : children}
    </RadioGroupPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
export type { RadioOption }
