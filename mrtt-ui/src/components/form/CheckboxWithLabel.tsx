'use client'

import { useId, type ComponentProps, type ReactNode } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/cn'

type CheckboxWithLabelProps = ComponentProps<typeof Checkbox> & {
  label: ReactNode
  /** Classes for the label wrapping the checkbox and its text. */
  labelClassName?: string
}

/** A checkbox with its text, both clickable. */
function CheckboxWithLabel({
  label,
  labelClassName,
  id,
  ...checkboxProps
}: CheckboxWithLabelProps) {
  const generatedId = useId()
  const checkboxId = id ?? generatedId

  return (
    <label
      htmlFor={checkboxId}
      className={cn('flex cursor-pointer items-center gap-3 py-2', labelClassName)}>
      <Checkbox id={checkboxId} {...checkboxProps} />
      <span>{label}</span>
    </label>
  )
}

export default CheckboxWithLabel
export type { CheckboxWithLabelProps }
