import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

// Tailwind versions of the form layout pieces in styles/forms.js, with the same sizes.
// themeMui.spacing(n) is 5n px.

/** Question label that sticks under the header and section nav while its question scrolls. */
function StickyFormLabel({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      data-slot='sticky-form-label'
      className={cn(
        'sticky top-[calc(var(--spacing-header)+var(--spacing-section-nav))] z-2 mb-2 block border-b border-[#009b93] bg-inherit py-3.75 text-base font-bold text-text max-[599px]:top-header',
        className
      )}
      {...props}
    />
  )
}

/** Centred row for a tabular row's Save / Cancel buttons. */
function TabularButtonsDiv({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='tabular-buttons'
      className={cn('mt-6 flex items-center justify-center', className)}
      {...props}
    />
  )
}

export { StickyFormLabel, TabularButtonsDiv }
