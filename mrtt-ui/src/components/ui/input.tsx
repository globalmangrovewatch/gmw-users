import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'flex h-9 w-full rounded-3xl border border-black/15 bg-transparent px-3 py-2 text-sm text-text ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/60 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error',
        className
      )}
      {...props}
    />
  )
}

export { Input }
