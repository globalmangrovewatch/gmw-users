import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

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

type ButtonProps = useRender.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

/** Renders a <button>; pass `render={<a href='…' />}` (or next/link) to style another element. */
function Button({ className, variant, size, render, ...props }: ButtonProps) {
  return useRender({
    defaultTagName: 'button',
    render,
    props: mergeProps<'button'>(
      { className: cn(buttonVariants({ variant, size }), className) },
      { 'data-slot': 'button' } as Record<string, string>,
      props
    )
  })
}

export { Button, buttonVariants }
export type { ButtonProps }
