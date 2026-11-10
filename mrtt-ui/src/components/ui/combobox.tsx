'use client'

import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { LuCheck, LuChevronsUpDown, LuX } from 'react-icons/lu'

import { cn } from '@/lib/cn'

type ComboboxOption<T extends string = string> = {
  label: string
  value: T
}

type ComboboxProps<T extends string = string> = {
  options: ComboboxOption<T>[]
  value?: T | null
  onChange: (value: T | null) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  id?: string
  className?: string
  'aria-invalid'?: boolean
}

/** Searchable single select: type in the input to filter the options. The clear button resets it. */
function Combobox<T extends string = string>({
  options,
  value = null,
  onChange,
  placeholder = 'Select…',
  emptyText = 'No results.',
  disabled,
  id,
  className,
  'aria-invalid': ariaInvalid
}: ComboboxProps<T>) {
  const selected = options.find((option) => option.value === value) ?? null

  return (
    <ComboboxPrimitive.Root
      items={options}
      value={selected}
      onValueChange={(option) => onChange(option?.value ?? null)}
      disabled={disabled}>
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

export { Combobox }
export type { ComboboxOption, ComboboxProps }
