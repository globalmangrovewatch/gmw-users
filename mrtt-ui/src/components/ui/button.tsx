import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-3xl border border-transparent text-sm font-medium ring-offset-white transition-colors focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-800 text-white hover:bg-brand-800/90',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        outline:
          'border-brand-800/15 bg-transparent text-brand-800 hover:bg-brand-100 hover:text-brand-900',
        secondary: 'bg-white text-brand-800 hover:bg-brand-100 hover:text-brand-900',
        ghost: 'bg-brand-800/15 text-text hover:bg-white hover:text-grey-dark',
        link: 'rounded-full text-brand-800 underline-offset-4 hover:underline',
        rounded: 'rounded-full'
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1',
        lg: 'rounded-[32px] px-6 py-3.5',
        xl: 'px-8 py-2',
        icon: 'size-11',
        none: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
