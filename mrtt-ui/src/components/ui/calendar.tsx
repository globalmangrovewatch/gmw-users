'use client'

import type { ComponentProps } from 'react'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp
} from 'react-icons/md'

import { cn } from '@/lib/cn'

const chevrons = {
  left: MdKeyboardArrowLeft,
  right: MdKeyboardArrowRight,
  up: MdKeyboardArrowUp,
  down: MdKeyboardArrowDown
}

const navButtonClassName =
  'flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-black/54 hover:bg-black/4 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none aria-disabled:pointer-events-none aria-disabled:opacity-40'

/**
 * Month calendar in the MUI date picker look the app used before: month caption on the left,
 * arrows on the right, single-letter weekdays, Monday first, 36px round days, today outlined
 * and the selected day filled.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  weekStartsOn = 1,
  captionLayout = 'label',
  formatters,
  components,
  ...props
}: ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      data-slot='calendar'
      showOutsideDays={showOutsideDays}
      weekStartsOn={weekStartsOn}
      captionLayout={captionLayout}
      className={cn('w-fit bg-white px-4 pb-2 text-sm text-text', className)}
      classNames={{
        root: cn('w-fit', defaults.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaults.months),
        month: cn('flex w-full flex-col', defaults.month),
        nav: cn('absolute top-0 right-0 flex h-12 items-center gap-2', defaults.nav),
        button_previous: cn(navButtonClassName, defaults.button_previous),
        button_next: cn(navButtonClassName, defaults.button_next),
        month_caption: cn('flex h-12 w-full items-center pl-2', defaults.month_caption),
        dropdowns: cn('flex h-8 items-center gap-1.5 text-base font-medium', defaults.dropdowns),
        dropdown_root: cn('relative rounded border border-black/23', defaults.dropdown_root),
        dropdown: cn('absolute inset-0 opacity-0', defaults.dropdown),
        caption_label: cn(
          'text-base font-medium select-none',
          captionLayout !== 'label' && 'flex h-8 items-center gap-1 pr-1 pl-2 [&>svg]:size-5',
          defaults.caption_label
        ),
        month_grid: 'border-collapse',
        weekdays: cn('flex', defaults.weekdays),
        weekday: cn(
          'flex h-10 w-10 items-center justify-center text-xs font-normal text-black/60 select-none',
          defaults.weekday
        ),
        week: cn('flex', defaults.week),
        day: cn('flex h-10 w-10 items-center justify-center p-0 select-none', defaults.day),
        day_button: cn(
          'flex size-9 cursor-pointer items-center justify-center rounded-full border border-transparent bg-transparent p-0 text-sm text-text hover:bg-black/4 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none',
          defaults.day_button
        ),
        selected: cn(
          '[&>button]:bg-brand-800 [&>button]:font-medium [&>button]:text-white [&>button]:hover:bg-[#005d58]',
          defaults.selected
        ),
        range_start: cn('rounded-l-full bg-brand-100', defaults.range_start),
        range_middle: cn(
          'bg-brand-100 [&>button]:bg-transparent [&>button]:text-brand-900',
          defaults.range_middle
        ),
        range_end: cn('rounded-r-full bg-brand-100', defaults.range_end),
        today: cn('[&>button]:border-black/60', defaults.today),
        outside: cn('text-black/40', defaults.outside),
        disabled: cn('text-black/40 opacity-50', defaults.disabled),
        hidden: cn('invisible', defaults.hidden),
        ...classNames
      }}
      formatters={{
        // "M", "T", "W"… like MUI.
        formatWeekdayName: (weekday, options, dateLib) =>
          dateLib ? dateLib.format(weekday, 'EEEEE') : weekday.toString().charAt(0),
        ...formatters
      }}
      components={{
        Chevron: ({ className, orientation = 'left' }) => {
          const Icon = chevrons[orientation]
          return <Icon className={cn('size-6 shrink-0', className)} aria-hidden='true' />
        },
        ...components
      }}
      {...props}
    />
  )
}

export { Calendar }
