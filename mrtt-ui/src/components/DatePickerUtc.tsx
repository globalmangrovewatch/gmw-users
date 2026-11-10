'use client'

import { useState } from 'react'
import { LuCalendar } from 'react-icons/lu'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TextSmall } from '@/components/ui/typography'
import language from '@/language'
import { cn } from '@/lib/cn'
import { formatIsoDay, parseIsoDay, toUtcIsoDay } from '@/lib/dates'

type DatePickerUtcField = {
  value?: unknown
  onChange: (value: string | null) => void
  onBlur?: () => void
}

type DatePickerUtcProps = {
  /** The react-hook-form `field` from a Controller render. */
  field: DatePickerUtcField
  id?: string
  /** Accessible name, also shown while no date is picked. */
  label?: string
  /** Replaces `field.onChange`. Receives the same `…T00:00:00.000Z` string. */
  onChange?: (value: string | null) => void
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
}

/** Picks a calendar day and stores it as an ISO string at UTC midnight. */
function DatePickerUtc({
  field,
  id,
  label,
  onChange,
  disabled,
  className,
  'aria-invalid': ariaInvalid
}: DatePickerUtcProps) {
  const [open, setOpen] = useState(false)
  const selected = parseIsoDay(field.value)

  const handleSelect = (date: Date | undefined) => {
    const value = date ? toUtcIsoDay(date) : null
    ;(onChange ?? field.onChange)(value)
    field.onBlur?.()
    setOpen(false)
  }

  return (
    <div className={cn('flex flex-col gap-3.75', className)}>
      <TextSmall>{language.form.dateUtc}</TextSmall>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          aria-label={label}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          data-slot='date-picker-trigger'
          className='flex h-14 w-full max-w-80 cursor-pointer items-center justify-between gap-2 rounded border border-black/25 bg-white px-3.5 text-left text-base text-text hover:border-black/90 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-50'>
          <span className={cn(!selected && 'text-black/60')}>
            {selected ? formatIsoDay(selected) : (label ?? 'yyyy/mm/dd')}
          </span>
          <LuCalendar className='size-5 shrink-0 opacity-60' aria-hidden='true' />
        </PopoverTrigger>
        <PopoverContent align='start' className='p-0'>
          <Calendar
            mode='single'
            timeZone='UTC'
            selected={selected}
            defaultMonth={selected}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerUtc
export { DatePickerUtc }
export type { DatePickerUtcProps }
