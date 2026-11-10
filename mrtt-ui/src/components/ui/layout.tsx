import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

/*
 * Tailwind versions of the exports in src/styles/containers.js, lists.js and table.js, same
 * names, so unconverted screens keep working until they move to ui/* (GMW-1123, GMW-1124).
 * themeMui.spacing(n) = 5n px: spacing(2) → 2.5, spacing(3) → 3.75, spacing(1) → 1.25.
 * theme.color.primary #009b93 has no token; theme.color.slub is #333333D9.
 */

// containers.js

function PagePadding({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('p-2.5', className)} {...props} />
}

function RowSpaceBetween({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex justify-between', className)} {...props} />
}

function RowFlexEnd({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex justify-end', className)} {...props} />
}

function ButtonContainer({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex justify-end gap-2.5', className)} {...props} />
}

function RowCenterCenter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-center', className)} {...props} />
}

const cardClassName =
  'my-2.5 block border-2 border-solid bg-white p-3.75 text-[#333333D9] no-underline'

/** Renders a <div>; pass `render={<li />}` to use another element. */
function Card({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>({ className: cn(cardClassName, 'border-[#009b93]', className) }, props)
  })
}

function LinkCard({ className, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={cn(
        cardClassName,
        'cursor-pointer border-green-light [@media(hover:none)]:border-[#009b93] hover:border-[#009b93] hover:text-text',
        className
      )}
      {...props}
    />
  )
}

function ContentWrapper({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto min-h-[calc(100vh-var(--spacing-header))] max-w-content p-2.5',
        className
      )}
      {...props}
    />
  )
}

function TitleAndActionContainer({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-between', className)} {...props} />
}

/** Was an MUI Stack: a flex column. */
function PaddedSection({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col p-2.5', className)} {...props} />
}

function QuestionWrapper({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex max-w-content flex-col', className)} {...props} />
}

function LoadingWrapper({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('grid h-screen place-items-center', className)} {...props} />
}

// lists.js

function UlAlternating({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'm-0 list-none p-0 [&>li:nth-of-type(even)]:bg-row-even [&>li:nth-of-type(odd)]:bg-row-odd',
        className
      )}
      {...props}
    />
  )
}

function UlUndecorated({ className, ...props }: ComponentProps<'ul'>) {
  return <ul className={cn('m-0 list-none p-0', className)} {...props} />
}

// table.js

function TableAlertnatingRows({ className, ...props }: ComponentProps<'table'>) {
  return (
    <table
      className={cn(
        'w-full text-left [&_td]:p-1.25 [&_th]:p-1.25 [&_th]:font-normal [&_tr:nth-of-type(even)]:bg-row-even [&_tr:nth-of-type(odd)]:bg-row-odd',
        className
      )}
      {...props}
    />
  )
}

function TdCenter({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('text-center', className)} {...props} />
}

function ThCenter({ className, ...props }: ComponentProps<'th'>) {
  return <th className={cn('text-center', className)} {...props} />
}

function WideTh({ className, ...props }: ComponentProps<'th'>) {
  return <th className={cn('w-full', className)} {...props} />
}

export {
  ButtonContainer,
  Card,
  ContentWrapper,
  LinkCard,
  LoadingWrapper,
  PaddedSection,
  PagePadding,
  QuestionWrapper,
  RowCenterCenter,
  RowFlexEnd,
  RowSpaceBetween,
  TableAlertnatingRows,
  TdCenter,
  ThCenter,
  TitleAndActionContainer,
  UlAlternating,
  UlUndecorated,
  WideTh
}
