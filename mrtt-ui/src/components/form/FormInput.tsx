'use client'

import type { Select as SelectPrimitive } from '@base-ui/react/select'
import type { ComponentProps, ReactNode } from 'react'
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps
} from 'react-hook-form'

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
// <FormProvider> and shows the field's validation message itself. The field props come from
// react-hook-form's controller; everything else goes to the ui/* control it renders.

type FieldProps<T extends FieldValues, TName extends FieldPath<T>> = Pick<
  UseControllerProps<T, TName>,
  'name' | 'rules' | 'disabled' | 'defaultValue'
> & {
  label: ReactNode
  required?: boolean
  description?: ReactNode
  /** Classes for the field wrapper (label + control + message). */
  className?: string
}

/** Control props the field owns, so they can't be passed to the control directly. */
type FieldOwnedProps =
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'disabled'
  | 'ref'

type FormInputProps<T extends FieldValues, TName extends FieldPath<T>> = FieldProps<T, TName> &
  Omit<ComponentProps<typeof Input>, FieldOwnedProps | 'className'>

function FormInput<T extends FieldValues = FieldValues, TName extends FieldPath<T> = FieldPath<T>>({
  name,
  rules,
  disabled,
  defaultValue,
  label,
  required,
  description,
  className,
  ...inputProps
}: FormInputProps<T, TName>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Input {...inputProps} {...field} value={field.value ?? ''} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type FormTextareaProps<T extends FieldValues, TName extends FieldPath<T>> = FieldProps<T, TName> &
  Omit<ComponentProps<typeof Textarea>, FieldOwnedProps | 'className'>

function FormTextarea<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
>({
  name,
  rules,
  disabled,
  defaultValue,
  label,
  required,
  description,
  className,
  ...textareaProps
}: FormTextareaProps<T, TName>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <FormControl>
            <Textarea {...textareaProps} {...field} value={field.value ?? ''} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type FormSelectOption = { label: string; value: string }

type FormSelectProps<T extends FieldValues, TName extends FieldPath<T>> = FieldProps<T, TName> &
  Omit<
    SelectPrimitive.Root.Props<string>,
    FieldOwnedProps | 'onValueChange' | 'items' | 'children'
  > & {
    options: FormSelectOption[]
    placeholder?: string
  }

function FormSelect<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
>({
  name,
  rules,
  disabled,
  defaultValue,
  label,
  required,
  description,
  className,
  options,
  placeholder,
  ...selectProps
}: FormSelectProps<T, TName>) {
  const { control } = useFormContext<T>()

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel required={required}>{label}</FormLabel>
          <Select<string>
            {...selectProps}
            items={options}
            name={field.name}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value ?? '')}
            disabled={field.disabled}>
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

type FormRadioGroupProps<T extends FieldValues, TName extends FieldPath<T>> = FieldProps<T, TName> &
  Omit<ComponentProps<typeof RadioGroup>, FieldOwnedProps | 'onValueChange' | 'className'> & {
    options: RadioOption[]
  }

function FormRadioGroup<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>
>({
  name,
  rules,
  disabled,
  defaultValue,
  label,
  required,
  description,
  className,
  options,
  ...radioGroupProps
}: FormRadioGroupProps<T, TName>) {
  const { control } = useFormContext<T>()
  const labelId = `${name}-label`

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel id={labelId} required={required}>
            {label}
          </FormLabel>
          <FormControl>
            <RadioGroup
              aria-labelledby={labelId}
              {...radioGroupProps}
              options={options}
              name={field.name}
              value={field.value ?? null}
              onValueChange={(value) => field.onChange(value)}
              disabled={field.disabled}
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
