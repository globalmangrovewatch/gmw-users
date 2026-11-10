'use client'

import type { ComponentType, Ref } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import language from '@/language'
import { makeValidClassName } from '@/library/strings/makeValidClassName'

type CheckboxGroupOptionValue = string | number

type CheckboxGroupOption = {
  label: string
  value: CheckboxGroupOptionValue
}

type CheckboxGroupValue = {
  selectedValues?: CheckboxGroupOptionValue[]
  isOtherChecked?: boolean
  otherValue?: string
}

/** What a checkbox change looked like, for consumers that read `event.target` (`shouldReturnEvent`). */
type CheckboxGroupChangeEvent = {
  target: { value: string; checked: boolean }
}

type CheckboxGroupChange = {
  selectedValues: CheckboxGroupOptionValue[]
  isOtherChecked: boolean
  otherValue?: string
  event?: CheckboxGroupChangeEvent
}

type SelectedMarkupProps = {
  optionId: string
  optionValue: CheckboxGroupOptionValue
}

type CheckboxGroupProps = {
  id: string
  options: CheckboxGroupOption[]
  onChange: (value: CheckboxGroupChange) => void
  onBlur?: () => void
  value?: CheckboxGroupValue | null
  optionsExcludedFromShowingSelectedMarkup?: CheckboxGroupOptionValue[]
  shouldAddOtherOptionWithClarification?: boolean
  /** Rendered under each checked option (and under "Other" when it's checked). */
  SelectedMarkup?: ComponentType<SelectedMarkupProps>
  /** Add `event` to the value passed to onChange. */
  shouldReturnEvent?: boolean
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
  'aria-labelledby'?: string
}

const getValueToReturn = ({
  nonOtherSelectedValues,
  otherInputValue,
  isOtherChecked,
  event,
  shouldReturnEvent
}: {
  nonOtherSelectedValues: CheckboxGroupOptionValue[]
  otherInputValue: string
  isOtherChecked: boolean
  event: CheckboxGroupChangeEvent
  shouldReturnEvent: boolean
}): CheckboxGroupChange => {
  // isOtherChecked is always explicit, so validation doesn't have to tell '' from undefined.
  const valueToReturn: CheckboxGroupChange = {
    selectedValues: nonOtherSelectedValues,
    isOtherChecked
  }
  if (isOtherChecked) {
    valueToReturn.otherValue = otherInputValue
  }
  if (shouldReturnEvent) {
    // Only when the consumer handles onChange itself: react-hook-form shouldn't store the event.
    valueToReturn.event = event
  }

  return valueToReturn
}

/**
 * Multi-select checkboxes with an optional "Other" + clarification input.
 * Fully controlled: everything shown derives from `value`, which the form owns.
 */
function CheckboxGroup({
  id,
  options,
  onChange,
  onBlur,
  value,
  optionsExcludedFromShowingSelectedMarkup = [],
  shouldAddOtherOptionWithClarification = false,
  SelectedMarkup,
  shouldReturnEvent = false,
  disabled,
  ref,
  'aria-labelledby': ariaLabelledBy
}: CheckboxGroupProps) {
  const isOtherChecked = !!value?.isOtherChecked
  const nonOtherSelectedValues = value?.selectedValues ?? []
  const otherInputValue = value?.otherValue ?? ''

  const emit = (
    next: Partial<Pick<CheckboxGroupChange, 'selectedValues' | 'isOtherChecked'>> & {
      otherValue?: string
    },
    event: CheckboxGroupChangeEvent
  ) =>
    onChange(
      getValueToReturn({
        nonOtherSelectedValues: next.selectedValues ?? nonOtherSelectedValues,
        otherInputValue: next.otherValue ?? otherInputValue,
        isOtherChecked: next.isOtherChecked ?? isOtherChecked,
        shouldReturnEvent,
        event
      })
    )

  const handleNonOtherCheckboxChange = (itemValue: CheckboxGroupOptionValue, checked: boolean) => {
    const selectedValues = nonOtherSelectedValues.includes(itemValue)
      ? nonOtherSelectedValues.filter((selected) => selected !== itemValue)
      : [...nonOtherSelectedValues, itemValue]

    emit({ selectedValues }, { target: { value: String(itemValue), checked } })
  }

  return (
    <div
      ref={ref}
      role='group'
      aria-labelledby={ariaLabelledBy}
      data-slot='checkbox-group'
      className='flex flex-col'>
      {options.map((option) => {
        const isChecked = nonOtherSelectedValues.includes(option.value)
        const optionId = makeValidClassName(`${id}-${option.value}`)
        const isSelectedMarkupShowing =
          isChecked &&
          SelectedMarkup &&
          !optionsExcludedFromShowingSelectedMarkup.includes(option.value)

        return (
          <div key={option.value} className='flex flex-col'>
            <label className='flex w-fit cursor-pointer items-center gap-2.5 py-2 text-base text-text'>
              <Checkbox
                id={optionId}
                value={String(option.value)}
                checked={isChecked}
                disabled={disabled}
                onBlur={onBlur}
                onCheckedChange={(checked) => handleNonOtherCheckboxChange(option.value, checked)}
              />
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
            <Checkbox
              id={`${id}-other`}
              value='other'
              checked={isOtherChecked}
              disabled={disabled}
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
              value={otherInputValue}
              disabled={disabled}
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
    </div>
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
