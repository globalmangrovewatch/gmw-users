'use client'

import type { ComponentProps } from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { LuChevronDown, LuChevronLeft, LuChevronRight, LuChevronUp } from 'react-icons/lu'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/cn'

const chevrons = {
  left: LuChevronLeft,
  right: LuChevronRight,
  up: LuChevronUp,
  down: LuChevronDown
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  components,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      data-slot='calendar'
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      className={cn('w-fit bg-white p-3 text-sm text-text', className)}
      classNames={{
        root: cn('w-fit', defaults.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaults.months),
        month: cn('flex w-full flex-col gap-4', defaults.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaults.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: 'secondary', size: 'none' }),
          'size-8 rounded-full p-0 aria-disabled:opacity-50',
          defaults.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: 'secondary', size: 'none' }),
          'size-8 rounded-full p-0 aria-disabled:opacity-50',
          defaults.button_next
        ),
        month_caption: cn(
          'flex h-8 w-full items-center justify-center px-8',
          defaults.month_caption
        ),
        dropdowns: cn(
          'flex h-8 items-center justify-center gap-1.5 text-sm font-medium',
          defaults.dropdowns
        ),
        dropdown_root: cn('relative rounded-md border border-black/15', defaults.dropdown_root),
        dropdown: cn('absolute inset-0 opacity-0', defaults.dropdown),
        caption_label: cn(
          'font-semibold select-none',
          captionLayout !== 'label' &&
            'flex h-8 items-center gap-1 rounded-md pr-1 pl-2 [&>svg]:size-3.5',
          defaults.caption_label
        ),
        month_grid: 'w-full border-collapse',
        weekdays: cn('flex', defaults.weekdays),
        weekday: cn(
          'flex-1 rounded-md text-[0.8rem] font-normal text-black/60 select-none',
          defaults.weekday
        ),
        week: cn('mt-2 flex w-full', defaults.week),
        day: cn('relative aspect-square w-full p-0 text-center select-none', defaults.day),
        day_button: cn(
          'flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-sm hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none',
          defaults.day_button
        ),
        selected: cn(
          '[&>button]:bg-brand-800 [&>button]:text-white [&>button]:hover:bg-brand-800/90',
          defaults.selected
        ),
        range_start: cn('rounded-l-full bg-brand-100', defaults.range_start),
        range_middle: cn(
          'bg-brand-100 [&>button]:bg-transparent [&>button]:text-brand-900',
          defaults.range_middle
        ),
        range_end: cn('rounded-r-full bg-brand-100', defaults.range_end),
        today: cn('[&>button]:font-bold [&>button]:text-brand-800', defaults.today),
        outside: cn('text-black/40', defaults.outside),
        disabled: cn('text-black/40 opacity-50', defaults.disabled),
        hidden: cn('invisible', defaults.hidden),
        ...classNames
      }}
      components={{
        Chevron: ({ className, orientation = 'left' }) => {
          const Icon = chevrons[orientation]
          return <Icon className={cn('size-4', className)} aria-hidden='true' />
        },
        ...components
      }}
      {...props}
    />
  )
}

export { Calendar }
