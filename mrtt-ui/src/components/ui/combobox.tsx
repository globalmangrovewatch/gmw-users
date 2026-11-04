'use client'

import { useState } from 'react'
import { LuCheck, LuChevronsUpDown } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  id?: string
  className?: string
  'aria-invalid'?: boolean
}

/** Searchable single select: a Popover holding a Command list. Picking the current value clears it. */
function Combobox<T extends string = string>({
  options,
  value = null,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  disabled,
  id,
  className,
  'aria-invalid': ariaInvalid
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          data-slot='combobox-trigger'
          className={cn(
            'h-9 w-full justify-between border-black/15 px-3 font-normal text-text hover:bg-transparent hover:text-text aria-invalid:border-error',
            !selected && 'text-black/60',
            className
          )}>
          <span className='truncate'>{selected ? selected.label : placeholder}</span>
          <LuChevronsUpDown className='size-4 shrink-0 opacity-60' aria-hidden='true' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='w-(--radix-popover-trigger-width) p-0'>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value === value ? null : option.value)
                    setOpen(false)
                  }}>
                  <LuCheck
                    aria-hidden='true'
                    className={cn(
                      'size-4 text-brand-800',
                      option.value === value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { Combobox }
export type { ComboboxOption, ComboboxProps }
