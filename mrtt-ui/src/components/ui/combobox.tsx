'use client'

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { useRef, type ComponentProps } from 'react'
import { LuCheck, LuChevronsUpDown, LuX } from 'react-icons/lu'

import { cn } from '@/lib/cn'

type ComboboxOption<T extends string = string> = {
  label: string
  value: T
}

/** Props that go to the text input (its id, so a <label htmlFor> works, and aria-*). */
type ComboboxInputProps = Pick<
  ComponentProps<typeof ComboboxPrimitive.Input>,
  'id' | 'placeholder' | 'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'aria-describedby'
>

type ComboboxProps<T extends string = string> = Omit<
  ComboboxPrimitive.Root.Props<ComboboxOption<T>>,
  'items' | 'value' | 'defaultValue' | 'onValueChange' | 'children' | 'multiple'
> &
  ComboboxInputProps & {
    options: ComboboxOption<T>[]
    /** The selected option's value (not the option object). */
    value?: T | null
    onChange: (value: T | null) => void
    emptyText?: string
    /** Classes for the input group (input + clear + trigger). */
    className?: string
  }

/** Searchable single select: type in the input to filter the options. The clear button resets it. */
function Combobox<T extends string = string>({
  options,
  value = null,
  onChange,
  placeholder = 'Select…',
  emptyText = 'No results.',
  className,
  id,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rootProps
}: ComboboxProps<T>) {
  const selected = options.find((option) => option.value === value) ?? null

  return (
    <ComboboxPrimitive.Root
      {...rootProps}
      items={options}
      value={selected}
      onValueChange={(option) => onChange(option?.value ?? null)}>
      <ComboboxPrimitive.InputGroup
        data-slot='combobox'
        className={cn(
          'relative flex h-9 w-full items-center rounded-3xl border border-black/15 bg-white text-sm text-text ring-offset-white focus-within:ring-2 focus-within:ring-brand-800 focus-within:ring-offset-2 has-aria-invalid:border-error has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50',
          className
        )}>
        <ComboboxPrimitive.Input
          id={id}
          placeholder={placeholder}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          className='h-full w-full min-w-0 rounded-3xl border-0 bg-transparent pr-16 pl-3 outline-none placeholder:text-black/60'
        />
        <div className='absolute right-2 flex items-center gap-1'>
          <ComboboxPrimitive.Clear
            aria-label='Clear selection'
            className='flex size-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-text hover:bg-brand-100'>
            <LuX className='size-4' aria-hidden='true' />
          </ComboboxPrimitive.Clear>
          <ComboboxPrimitive.Trigger
            aria-label='Show options'
            className='flex size-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-text'>
            <LuChevronsUpDown className='size-4 opacity-60' aria-hidden='true' />
          </ComboboxPrimitive.Trigger>
        </div>
      </ComboboxPrimitive.InputGroup>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner className='z-50 outline-none' align='start' sideOffset={4}>
          <ComboboxPrimitive.Popup
            data-slot='combobox-content'
            className='w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-md border border-black/15 bg-white text-text shadow-md outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95'>
            <ComboboxPrimitive.Empty>
              <div className='py-6 text-center text-sm'>{emptyText}</div>
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List className='max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 outline-none data-empty:p-0'>
              {(option: ComboboxOption<T>) => (
                <ComboboxPrimitive.Item
                  key={option.value}
                  value={option}
                  className='grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-brand-100 data-highlighted:text-brand-900'>
                  <ComboboxPrimitive.ItemIndicator className='col-start-1'>
                    <LuCheck className='size-4 text-brand-800' aria-hidden='true' />
                  </ComboboxPrimitive.ItemIndicator>
                  <span className='col-start-2'>{option.label}</span>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  )
}

type MultiComboboxProps<T extends string = string> = Omit<
  ComboboxPrimitive.Root.Props<ComboboxOption<T>, true>,
  'items' | 'value' | 'defaultValue' | 'onValueChange' | 'children' | 'multiple'
> &
  ComboboxInputProps & {
    options: ComboboxOption<T>[]
    /** The selected options' values (not the option objects). */
    value?: T[]
    onChange: (value: T[]) => void
    emptyText?: string
    /** Classes for the chips container (chips + input). */
    className?: string
  }

/** Searchable multi select: each selected option shows as a removable chip before the input. */
function MultiCombobox<T extends string = string>({
  options,
  value = [],
  onChange,
  placeholder = 'Select…',
  emptyText = 'No results.',
  className,
  id,
  'aria-invalid': ariaInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...rootProps
}: MultiComboboxProps<T>) {
  const chipsRef = useRef<HTMLDivElement>(null)
  const selected = options.filter((option) => value.includes(option.value))

  return (
    <ComboboxPrimitive.Root
      {...rootProps}
      multiple
      items={options}
      value={selected}
      onValueChange={(next) => onChange(next.map((option) => option.value))}>
      <ComboboxPrimitive.Chips
        ref={chipsRef}
        data-slot='multi-combobox'
        className={cn(
          'flex min-h-9 w-full flex-wrap items-center gap-1 rounded-3xl border border-black/15 bg-white px-2 py-1 text-sm text-text ring-offset-white focus-within:ring-2 focus-within:ring-brand-800 focus-within:ring-offset-2 has-aria-invalid:border-error has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50',
          className
        )}>
        <ComboboxPrimitive.Value>
          {(current: ComboboxOption<T>[]) => (
            <>
              {current.map((option) => (
                <ComboboxPrimitive.Chip
                  key={option.value}
                  aria-label={option.label}
                  className='flex items-center gap-1 rounded-full bg-brand-100 py-0.5 pr-1 pl-2.5 text-sm text-brand-900 outline-none data-highlighted:bg-brand-800 data-highlighted:text-white'>
                  {option.label}
                  <ComboboxPrimitive.ChipRemove
                    aria-label={`Remove ${option.label}`}
                    className='flex size-5 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-current hover:bg-black/10'>
                    <LuX className='size-3.5' aria-hidden='true' />
                  </ComboboxPrimitive.ChipRemove>
                </ComboboxPrimitive.Chip>
              ))}
              <ComboboxPrimitive.Input
                id={id}
                placeholder={current.length ? undefined : placeholder}
                aria-invalid={ariaInvalid}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-describedby={ariaDescribedBy}
                className='h-7 min-w-12 flex-1 border-0 bg-transparent px-1 outline-none placeholder:text-black/60'
              />
            </>
          )}
        </ComboboxPrimitive.Value>
      </ComboboxPrimitive.Chips>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          className='z-50 outline-none'
          align='start'
          sideOffset={4}
          anchor={chipsRef}>
          <ComboboxPrimitive.Popup
            data-slot='combobox-content'
            className='w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-md border border-black/15 bg-white text-text shadow-md outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95'>
            <ComboboxPrimitive.Empty>
              <div className='py-6 text-center text-sm'>{emptyText}</div>
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List className='max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 outline-none data-empty:p-0'>
              {(option: ComboboxOption<T>) => (
                <ComboboxPrimitive.Item
                  key={option.value}
                  value={option}
                  className='grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-brand-100 data-highlighted:text-brand-900'>
                  <ComboboxPrimitive.ItemIndicator className='col-start-1'>
                    <LuCheck className='size-4 text-brand-800' aria-hidden='true' />
                  </ComboboxPrimitive.ItemIndicator>
                  <span className='col-start-2'>{option.label}</span>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  )
}

export { Combobox, MultiCombobox }
export type { ComboboxOption, ComboboxProps, MultiComboboxProps }
