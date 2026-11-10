'use client'

import { useRender } from '@base-ui/react/use-render'
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactElement
} from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues
} from 'react-hook-form'

import { Label, type LabelProps } from '@/components/ui/label'
import { cn } from '@/lib/cn'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
  /** Whether a <FormDescription> is mounted inside this item. */
  hasDescription: boolean
  registerDescription: () => void
}

const FormItemContext = createContext<FormItemContextValue | null>(null)

function useFormField() {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })

  if (!fieldContext) throw new Error('useFormField should be used within <FormField>')
  if (!itemContext) throw new Error('useFormField should be used within <FormItem>')

  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    hasDescription: itemContext.hasDescription,
    ...fieldState
  }
}

function FormItem({ className, ...props }: ComponentProps<'div'>) {
  const id = useId()
  const [hasDescription, setHasDescription] = useState(false)

  const value = useMemo(
    () => ({ id, hasDescription, registerDescription: () => setHasDescription(true) }),
    [id, hasDescription]
  )

  return (
    <FormItemContext.Provider value={value}>
      <div data-slot='form-item' className={cn('grid gap-2', className)} {...props} />
    </FormItemContext.Provider>
  )
}

function FormLabel({ className, ...props }: LabelProps) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot='form-label'
      data-error={!!error}
      className={cn('mb-1 block text-text data-[error=true]:text-error', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: ComponentProps<'p'>) {
  const { formDescriptionId } = useFormField()
  const registerDescription = useContext(FormItemContext)?.registerDescription

  useEffect(() => {
    registerDescription?.()
  }, [registerDescription])

  return (
    <p
      data-slot='form-description'
      id={formDescriptionId}
      className={cn('text-sm text-black/60', className)}
      {...props}
    />
  )
}

/** Passes id and aria-* to its single child element (the input, select trigger, etc.). */
function FormControl({ children }: { children: ReactElement }) {
  const { error, formItemId, formDescriptionId, formMessageId, hasDescription } = useFormField()

  // Only point at ids that are in the DOM: a dangling aria-describedby reads as described
  // to automated checks while screen readers announce nothing.
  const describedBy =
    [hasDescription ? formDescriptionId : null, error ? formMessageId : null]
      .filter(Boolean)
      .join(' ') || undefined

  return useRender({
    render: children,
    props: {
      id: formItemId,
      'aria-describedby': describedBy,
      'aria-invalid': !!error
    }
  })
}

function FormMessage({ className, children, ...props }: ComponentProps<'p'>) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? '') : children

  if (!body) return null

  return (
    <p
      data-slot='form-message'
      id={formMessageId}
      className={cn('text-sm text-error', className)}
      {...props}>
      {body}
    </p>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField
}
