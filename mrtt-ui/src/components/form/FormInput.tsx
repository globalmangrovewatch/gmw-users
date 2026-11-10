'use client'

import type { ReactNode } from 'react'
import { useFormContext, type FieldValues, type Path } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, type RadioOption } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Labelled form fields on top of ui/form. Each reads `control` from the surrounding
// <FormProvider> and shows the field's validation message itself.

type BaseFieldProps<T extends FieldValues> = {
  name: Path<T>
  label: ReactNode
  required?: boolean
  description?: ReactNode
  className?: string
  disabled?: boolean
}

type FormInputProps<T extends FieldValues> = BaseFieldProps<T> & {
  type?: string
  placeholder?: string
  autoComplete?: string
}

function FormInput<T extends FieldValues = FieldValues>({
  name,
  label,
  required,
  description,
  className,
  disabled,
  type = 'text',
  placeholder,
  autoComplete
}: FormInputProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type FormTextareaProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string
  rows?: number
}

function FormTextarea<T extends FieldValues = FieldValues>({
  name,
  label,
  required,
  description,
  className,
  disabled,
  placeholder,
  rows
}: FormTextareaProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              value={field.value ?? ''}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type FormSelectOption = { label: string; value: string }

type FormSelectProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: FormSelectOption[]
  placeholder?: string
}

function FormSelect<T extends FieldValues = FieldValues>({
  name,
  label,
  required,
  description,
  className,
  disabled,
  options,
  placeholder
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <Select<string>
            items={options}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value ?? '')}
            disabled={disabled}>
            <FormControl>
              <SelectTrigger ref={field.ref} onBlur={field.onBlur}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type FormRadioGroupProps<T extends FieldValues> = BaseFieldProps<T> & {
  options: RadioOption[]
}

function FormRadioGroup<T extends FieldValues = FieldValues>({
  name,
  label,
  required,
  description,
  className,
  disabled,
  options
}: FormRadioGroupProps<T>) {
  const { control } = useFormContext<T>()
  const labelId = `${name}-label`

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel id={labelId} required={required}>
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup
              aria-labelledby={labelId}
              options={options}
              value={field.value ?? null}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormInput, FormRadioGroup, FormSelect, FormTextarea }
export type {
  FormInputProps,
  FormRadioGroupProps,
  FormSelectOption,
  FormSelectProps,
  FormTextareaProps
}
