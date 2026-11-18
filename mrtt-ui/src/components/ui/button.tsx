import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/cn'

// Matches the MUI buttons the app used before (contained / outlined): 4px corners, uppercase,
// 500 weight, 36.5px tall. The 1px border is always there so both variants share a height.
const containedShadow =
  'shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),0_2px_2px_0_rgba(0,0,0,0.14),0_1px_5px_0_rgba(0,0,0,0.12)] hover:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.2),0_4px_5px_0_rgba(0,0,0,0.14),0_1px_10px_0_rgba(0,0,0,0.12)]'

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded border border-transparent text-sm leading-[1.75] font-medium tracking-[0.02857em] uppercase ring-offset-white transition-[background-color,box-shadow,border-color,color] focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        default: cn('bg-brand-800 text-white hover:bg-[#005d58]', containedShadow),
        destructive: cn('bg-danger text-white hover:bg-danger/90', containedShadow),
        outline:
          'border-brand-800/50 bg-transparent text-brand-800 hover:border-brand-800 hover:bg-brand-800/4',
        secondary: 'bg-white text-brand-800 hover:bg-brand-100 hover:text-brand-900',
        ghost: 'bg-brand-800/15 text-text hover:bg-white hover:text-grey-dark',
        link: 'rounded-full text-brand-800 underline-offset-4 hover:underline',
        rounded: 'rounded-full'
      },
      size: {
        default: 'px-[15px] py-[5px]',
        sm: 'px-[9px] py-[3px] text-[13px]',
        lg: 'px-[21px] py-[7px] text-[15px]',
        xl: 'px-8 py-[5px]',
        icon: 'size-11 rounded-full',
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
