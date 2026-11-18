import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-xl border px-4 py-3 text-sm has-[>svg]:grid-cols-[--spacing(4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'border-black/15 bg-white text-text',
        info: 'border-brand-800/30 bg-brand-100 text-brand-900',
        // MUI's outlined error alert, the form banner the app showed before.
        destructive:
          'rounded border-[#ef5350] bg-transparent px-4 py-2 text-[#5f2120] has-[>svg]:grid-cols-[--spacing(5.5)_1fr] [&>svg]:size-5.5 [&>svg]:translate-y-0 [&>svg]:text-[#ef5350] *:data-[slot=alert-title]:text-base *:data-[slot=alert-title]:font-medium *:data-[slot=alert-description]:text-[#5f2120]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

function Alert({
  className,
  variant,
  ...props
}: ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot='alert'
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-title'
      className={cn('col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot='alert-description'
      className={cn('col-start-2 grid justify-items-start gap-1 text-sm text-black/60', className)}
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
