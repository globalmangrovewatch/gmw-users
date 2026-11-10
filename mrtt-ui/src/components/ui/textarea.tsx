import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'flex min-h-16 w-full rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm text-text ring-offset-white placeholder:text-black/60 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
