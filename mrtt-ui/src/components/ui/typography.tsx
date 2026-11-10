import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

/*
 * Tailwind versions of the exports in src/styles/typography.js, which now re-exports these, so
 * unconverted screens get them too until they import from here (GMW-1123, GMW-1124).
 * themeMui.spacing(1) = 5px → my-1.25; theme.typography.smallFontSize 15px → text-md;
 * xlargeFontSize 30px → text-3xl; theme.color.slub #333333D9.
 */

function ErrorText({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('text-error', className)} {...props} />
}

function H2({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn('my-1.25 text-[1.5em] font-bold', className)} {...props} />
}

function H4({ className, ...props }: ComponentProps<'h4'>) {
  return <h4 className={cn('my-1.25 font-bold', className)} {...props} />
}

function Link({ className, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={cn('inline-flex text-brand-800 underline hover:text-brand-hover', className)}
      {...props}
    />
  )
}

function LinkLooksLikeButtonPrimary({ className, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink className={cn(buttonVariants(), 'no-underline', className)} {...props} />
}

function LinkLooksLikeButtonSecondary({ className, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={cn(buttonVariants({ variant: 'outline' }), 'no-underline', className)}
      {...props}
    />
  )
}

function SmallUpperCase({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('text-md uppercase', className)} {...props} />
}

function TextSmall({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('text-md', className)} {...props} />
}

/** Renders an <h3>; pass `render={<h2 />}` to use another heading level. */
function ItemTitle({ className, render, ...props }: useRender.ComponentProps<'h3'>) {
  return useRender({
    defaultTagName: 'h3',
    render,
    props: mergeProps<'h3'>({ className: cn('m-0 text-3xl font-extralight', className) }, props)
  })
}

function PageTitle({ className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1 className={cn('text-3xl font-normal tracking-[2px] uppercase', className)} {...props} />
  )
}

function PageSubtitle({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn('mb-0 text-[1.5em] font-extralight', className)} {...props} />
}

function ItemSubTitle({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('m-0 text-md font-bold tracking-[1px] text-[#333333D9] uppercase', className)}
      {...props}
    />
  )
}

export {
  ErrorText,
  H2,
  H4,
  ItemSubTitle,
  ItemTitle,
  Link,
  LinkLooksLikeButtonPrimary,
  LinkLooksLikeButtonSecondary,
  PageSubtitle,
  PageTitle,
  SmallUpperCase,
  TextSmall
}
