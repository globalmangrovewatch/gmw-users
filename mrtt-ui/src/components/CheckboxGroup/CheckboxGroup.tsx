'use client'

import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group'
import type { ComponentProps, ComponentType } from 'react'
import type { ControllerRenderProps } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import language from '@/language'
import { cn } from '@/lib/cn'
import { makeValidClassName } from '@/library/strings/makeValidClassName'

type CheckboxGroupOption = {
  label: string
  value: string
}

/** How the API stores a multi-select answer. */
type CheckboxGroupValue = {
  selectedValues?: string[]
  isOtherChecked?: boolean
  otherValue?: string
}

/** What a checkbox change looked like, for consumers that read `event.target` (`shouldReturnEvent`). */
type CheckboxGroupChangeEvent = {
  target: { value: string; checked: boolean }
}

type CheckboxGroupChange = {
  selectedValues: string[]
  isOtherChecked: boolean
  otherValue?: string
  event?: CheckboxGroupChangeEvent
}

type SelectedMarkupProps = {
  optionId: string
  optionValue: string
}

type CheckboxGroupProps = Omit<
  ComponentProps<typeof CheckboxGroupPrimitive>,
  'value' | 'defaultValue' | 'onValueChange' | 'onChange' | 'onBlur' | 'children'
> &
  // Spread from a react-hook-form Controller `field`: `name` goes to each checkbox's input.
  Partial<Pick<ControllerRenderProps, 'name' | 'onBlur'>> & {
    /** Prefix for each checkbox's id. */
    id: string
    options: CheckboxGroupOption[]
    value?: CheckboxGroupValue | null
    onChange: (value: CheckboxGroupChange) => void
    optionsExcludedFromShowingSelectedMarkup?: string[]
    /** Adds an "Other" checkbox with a text input for the clarification. */
    shouldAddOtherOptionWithClarification?: boolean
    /** Rendered under each checked option (and under "Other" when it's checked). */
    SelectedMarkup?: ComponentType<SelectedMarkupProps>
    /** Add `event` to the value passed to onChange. */
    shouldReturnEvent?: boolean
  }

const toChange = ({
  selectedValues,
  isOtherChecked,
  otherValue,
  event,
  shouldReturnEvent
}: Required<Pick<CheckboxGroupChange, 'selectedValues' | 'isOtherChecked'>> & {
  otherValue: string
  event: CheckboxGroupChangeEvent
  shouldReturnEvent: boolean
}): CheckboxGroupChange => {
  // isOtherChecked is always explicit, so validation doesn't have to tell '' from undefined.
  const change: CheckboxGroupChange = { selectedValues, isOtherChecked }
  if (isOtherChecked) change.otherValue = otherValue
  // Only when the consumer handles onChange itself: react-hook-form shouldn't store the event.
  if (shouldReturnEvent) change.event = event

  return change
}

/**
 * Multi-select checkboxes (Base UI CheckboxGroup) with an optional "Other" + clarification input.
 * Fully controlled: everything shown derives from `value`, which the form owns.
 */
function CheckboxGroup({
  id,
  name,
  options,
  value,
  onChange,
  onBlur,
  optionsExcludedFromShowingSelectedMarkup = [],
  shouldAddOtherOptionWithClarification = false,
  SelectedMarkup,
  shouldReturnEvent = false,
  className,
  ...props
}: CheckboxGroupProps) {
  const selectedValues = value?.selectedValues ?? []
  const isOtherChecked = !!value?.isOtherChecked
  const otherValue = value?.otherValue ?? ''

  const emit = (
    next: Partial<Pick<CheckboxGroupChange, 'selectedValues' | 'isOtherChecked' | 'otherValue'>>,
    event: CheckboxGroupChangeEvent
  ) =>
    onChange(
      toChange({
        selectedValues: next.selectedValues ?? selectedValues,
        isOtherChecked: next.isOtherChecked ?? isOtherChecked,
        otherValue: next.otherValue ?? otherValue,
        shouldReturnEvent,
        event
      })
    )

  const handleValueChange = (nextSelectedValues: string[]) => {
    const added = nextSelectedValues.find((item) => !selectedValues.includes(item))
    const removed = selectedValues.find((item) => !nextSelectedValues.includes(item))

    emit(
      { selectedValues: nextSelectedValues },
      { target: { value: added ?? removed ?? '', checked: added !== undefined } }
    )
  }

  return (
    <CheckboxGroupPrimitive
      data-slot='checkbox-group'
      value={selectedValues}
      onValueChange={handleValueChange}
      className={cn('flex flex-col', className)}
      {...props}>
      {options.map((option) => {
        const optionId = makeValidClassName(`${id}-${option.value}`)
        const isSelectedMarkupShowing =
          SelectedMarkup &&
          selectedValues.includes(option.value) &&
          !optionsExcludedFromShowingSelectedMarkup.includes(option.value)

        return (
          <div key={option.value} className='flex flex-col'>
            <label className='flex w-fit cursor-pointer items-center gap-2.5 py-2 text-base text-text'>
              <Checkbox id={optionId} name={name} value={option.value} onBlur={onBlur} />
              {option.label}
            </label>
            {isSelectedMarkupShowing ? (
              <SelectedMarkup optionId={optionId} optionValue={option.value} />
            ) : null}
          </div>
        )
      })}
      {shouldAddOtherOptionWithClarification ? (
        <div className='flex flex-col'>
          <label className='flex w-fit cursor-pointer items-center gap-2.5 py-2 text-base text-text'>
            {/* No `value`: the group leaves it alone, so "Other" never lands in selectedValues. */}
            <Checkbox
              id={`${id}-other`}
              checked={isOtherChecked}
              onBlur={onBlur}
              onCheckedChange={(checked) =>
                emit({ isOtherChecked: checked }, { target: { value: 'other', checked } })
              }
            />
            {language.form.checkboxGroupOtherLabel}
          </label>
          {isOtherChecked ? (
            <Input
              aria-label={language.form.checkboxGroupOtherInputPlaceholder}
              placeholder={language.form.checkboxGroupOtherInputPlaceholder}
              className='mt-1 mb-2 max-w-md'
              value={otherValue}
              disabled={props.disabled}
              onChange={(event) =>
                emit(
                  { otherValue: event.target.value },
                  { target: { value: event.target.value, checked: true } }
                )
              }
            />
          ) : null}
          {isOtherChecked && SelectedMarkup ? (
            <SelectedMarkup optionId={`${id}-other`} optionValue='other' />
          ) : null}
        </div>
      ) : null}
    </CheckboxGroupPrimitive>
  )
}

export default CheckboxGroup
export type {
  CheckboxGroupChange,
  CheckboxGroupChangeEvent,
  CheckboxGroupOption,
  CheckboxGroupProps,
  CheckboxGroupValue,
  SelectedMarkupProps
}
