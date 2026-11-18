import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

/**
 * The MUI "outlined" field look the app used before: 4px corners, 16px text, darker border on
 * hover and a 2px brand border on focus (the inset shadow adds the second pixel without shifting
 * the layout). Shared by Input, Textarea, SelectTrigger and Combobox.
 */
const fieldClassName =
  'w-full rounded border border-black/23 bg-transparent text-base text-text transition-[border-color,box-shadow] hover:border-black/87 focus-visible:outline-none aria-invalid:border-error'

/** Focus ring for an element that is focused itself. */
const fieldFocusClassName =
  'focus:border-brand-800 focus:shadow-[inset_0_0_0_1px_var(--color-brand-800)] aria-invalid:focus:border-error aria-invalid:focus:shadow-[inset_0_0_0_1px_var(--color-error)]'

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        fieldClassName,
        fieldFocusClassName,
        'flex h-14 px-3.5 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/60 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { fieldClassName, fieldFocusClassName, Input }
