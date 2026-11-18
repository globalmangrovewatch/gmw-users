'use client'

import type { FieldPath } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import DatePickerUtc from '@/components/DatePickerUtc'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import type { RegistrationFormValues } from '@/forms/schemas'

type MonitoringDateFieldProps = {
  name: FieldPath<RegistrationFormValues>
  /** The question, shown as the field's label. Omit for a second date under the same question. */
  question?: string
  /** Placeholder and accessible name of the picker. */
  label: string
  required?: boolean
  labelClassName?: string
}

/** A date question of a monitoring form, with its validation message under the picker. */
function MonitoringDateField({
  name,
  question,
  label,
  required,
  labelClassName
}: MonitoringDateFieldProps) {
  const { control } = useFormContext<RegistrationFormValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {question ? (
            <FormLabel className={labelClassName} required={required}>
              {question}
            </FormLabel>
          ) : null}
          <FormControl>
            <DatePickerUtc label={label} field={field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default MonitoringDateField
export type { MonitoringDateFieldProps }
