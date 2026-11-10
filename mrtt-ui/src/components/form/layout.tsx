import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

// Tailwind versions of the form layout pieces in styles/forms.js, with the same sizes.
// themeMui.spacing(n) is 5n px. styles.mediaQueryDesktop is 599px.

/** Classes of a question label: sticks under the header and section nav while its question scrolls. */
const stickyFormLabelClassName =
  'sticky top-[calc(var(--spacing-header)+var(--spacing-section-nav))] z-2 mb-2 block border-b border-[#009b93] bg-inherit py-3.75 text-base font-bold text-text max-[599px]:top-header'

function StickyFormLabel({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      data-slot='sticky-form-label'
      className={cn(stickyFormLabelClassName, className)}
      {...props}
    />
  )
}

/** Page title and site name above a section form. */
function FormPageHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('py-2.5', className)} {...props} />
}

/** The section's questions; leaves room for the mobile footer. */
function FormLayout({ className, ...props }: ComponentProps<'form'>) {
  return (
    <form
      className={cn('mt-2.5 flex flex-col gap-3.75 pb-footer min-[599px]:pb-0', className)}
      {...props}
    />
  )
}

/** One question, on alternating row backgrounds. */
function FormQuestionDiv({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='form-question'
      className={cn('flex flex-col bg-row-even p-3.75 [&:nth-of-type(odd)]:bg-row-odd', className)}
      {...props}
    />
  )
}

/** A follow-up question indented under the answer it belongs to. */
function NestedQuestion({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-1.25 pl-2.5', className)} {...props} />
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

export {
  FormLayout,
  FormPageHeader,
  FormQuestionDiv,
  NestedQuestion,
  StickyFormLabel,
  stickyFormLabelClassName,
  TabularButtonsDiv
}
