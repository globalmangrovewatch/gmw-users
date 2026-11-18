'use client'

import { useState, type ComponentProps } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'
import { LuCalendar } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TextSmall } from '@/components/ui/typography'
import language from '@/language'
import { cn } from '@/lib/cn'
import { formatIsoDay, parseIsoDay, toUtcIsoDay } from '@/lib/dates'

type DatePickerUtcProps = Omit<ComponentProps<typeof PopoverTrigger>, 'children' | 'onChange'> & {
  /** The react-hook-form `field` from a Controller render. */
  field: Pick<ControllerRenderProps, 'value' | 'onChange'> &
    Partial<Pick<ControllerRenderProps, 'onBlur'>>
  /** Accessible name, also shown while no date is picked. */
  label?: string
  /** Replaces `field.onChange`. Receives the same `…T00:00:00.000Z` string. */
  onChange?: (value: string | null) => void
}

/** "Wed, Nov 18", the picker header's date. */
const formatHeaderDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })

/**
 * Picks a calendar day and stores it as an ISO string at UTC midnight. Like the MUI picker it
 * replaced, clicking a day only previews it in the header; OK saves it, Cancel discards it.
 */
function DatePickerUtc({ field, label, onChange, className, ...triggerProps }: DatePickerUtcProps) {
  const [open, setOpen] = useState(false)
  const selected = parseIsoDay(field.value)
  const [draft, setDraft] = useState<Date | undefined>(selected)

  const handleOpenChange = (nextOpen: boolean) => {
    // Every opening starts from the saved value.
    if (nextOpen) setDraft(selected)
    setOpen(nextOpen)
  }

  const handleConfirm = () => {
    const value = draft ? toUtcIsoDay(draft) : null
    ;(onChange ?? field.onChange)(value)
    field.onBlur?.()
    setOpen(false)
  }

  return (
    <div className='flex flex-col gap-3.75'>
      <TextSmall>{language.form.dateUtc}</TextSmall>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          aria-label={label}
          data-slot='date-picker-trigger'
          className={cn(
            'flex h-14 w-full max-w-80 cursor-pointer items-center justify-between gap-2 rounded border border-black/25 bg-white px-3.5 text-left text-base text-text hover:border-black/90 focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:outline-none aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...triggerProps}>
          <span className={cn(!selected && 'text-black/60')}>
            {selected ? formatIsoDay(selected) : (label ?? 'yyyy/mm/dd')}
          </span>
          <LuCalendar className='size-5 shrink-0 opacity-60' aria-hidden='true' />
        </PopoverTrigger>
        <PopoverContent align='start' className='w-fit rounded p-0 shadow-xl'>
          <div className='px-6 pt-4 pb-2'>
            <p className='text-xs font-medium tracking-wider text-black/60 uppercase'>
              {language.form.datePickerTitle}
            </p>
            <p className='mt-2 text-[2.125rem] leading-tight text-text'>
              {draft ? formatHeaderDate(draft) : language.form.datePickerEmpty}
            </p>
          </div>
          <Calendar
            mode='single'
            timeZone='UTC'
            selected={draft}
            defaultMonth={draft}
            onSelect={setDraft}
          />
          <div className='flex justify-end gap-2 px-2 pb-2'>
            <Button
              type='button'
              variant='secondary'
              className='shadow-none'
              onClick={() => setOpen(false)}>
              {language.buttons.cancel}
            </Button>
            <Button
              type='button'
              variant='secondary'
              className='shadow-none'
              disabled={!draft}
              onClick={handleConfirm}>
              {language.buttons.ok}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerUtc
export { DatePickerUtc }
export type { DatePickerUtcProps }
