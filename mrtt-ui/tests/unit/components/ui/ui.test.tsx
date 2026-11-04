import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Combobox } from '@/components/ui/combobox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loading } from '@/components/ui/loading'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Toaster, toast } from '@/components/ui/toast'
import * as Typography from '@/components/ui/typography'

// jsdom lacks the layout APIs Radix and cmdk call.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView ??= () => {}
  Element.prototype.hasPointerCapture ??= () => false
  Element.prototype.releasePointerCapture ??= () => {}
})

describe('ui/* components', () => {
  it('Button renders variants and asChild', () => {
    render(
      <>
        <Button>Save</Button>
        <Button variant='outline' asChild>
          <a href='/sites'>Sites</a>
        </Button>
      </>
    )
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass('bg-brand-800')
    expect(screen.getByRole('link', { name: 'Sites' })).toHaveClass('text-brand-800')
  })

  it('Input, Textarea and Label render and associate', () => {
    render(
      <>
        <Label htmlFor='name' required>
          Name
        </Label>
        <Input id='name' />
        <Label htmlFor='notes'>Notes</Label>
        <Textarea id='notes' />
      </>
    )
    expect(screen.getByLabelText(/Name/)).toBeInstanceOf(HTMLInputElement)
    expect(screen.getByLabelText('Notes')).toBeInstanceOf(HTMLTextAreaElement)
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('Checkbox toggles', async () => {
    const user = userEvent.setup()
    render(<Checkbox aria-label='Agree' />)
    const checkbox = screen.getByRole('checkbox', { name: 'Agree' })
    await user.click(checkbox)
    expect(checkbox).toHaveAttribute('data-state', 'checked')
  })

  it('RadioGroup renders options and selects one', async () => {
    const user = userEvent.setup()
    render(
      <RadioGroup
        aria-label='Tenure'
        options={[
          { label: 'Public', value: 'public' },
          { label: 'Private', value: 'private' }
        ]}
      />
    )
    await user.click(screen.getByRole('radio', { name: 'Private' }))
    expect(screen.getByRole('radio', { name: 'Private' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Public' })).not.toBeChecked()
  })

  it('Form wires label, description and error message to the control', async () => {
    function TestForm() {
      const form = useForm({ defaultValues: { site: '' } })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            <FormField
              control={form.control}
              name='site'
              rules={{ required: 'Site name is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>As shown on the map</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      )
    }
    const user = userEvent.setup()
    render(<TestForm />)
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    const input = screen.getByLabelText('Site name')
    expect(await screen.findByText('Site name is required')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('As shown on the map Site name is required')
  })

  it('Dialog opens with title, description and close button', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Site details</DialogTitle>
          <DialogDescription>Edit the site</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog', { name: 'Site details' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('AlertDialog confirms', async () => {
    const onConfirm = vi.fn<() => void>()
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete site?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('alertdialog', { name: 'Delete site?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('DropdownMenu opens and shows items', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    await user.click(screen.getByRole('button', { name: 'Menu' }))
    expect(await screen.findByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
  })

  it('Popover opens', async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger>Info</PopoverTrigger>
        <PopoverContent>More detail</PopoverContent>
      </Popover>
    )
    await user.click(screen.getByRole('button', { name: 'Info' }))
    expect(await screen.findByText('More detail')).toBeInTheDocument()
  })

  it('Command filters items', async () => {
    const user = userEvent.setup()
    render(
      <Command>
        <CommandInput placeholder='Search' />
        <CommandList>
          <CommandEmpty>Nothing</CommandEmpty>
          <CommandGroup heading='Countries'>
            <CommandItem>Spain</CommandItem>
            <CommandItem>Kenya</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
    await user.type(screen.getByPlaceholderText('Search'), 'ken')
    expect(screen.getByRole('option', { name: 'Kenya' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Spain' })).not.toBeInTheDocument()
  })

  it('Combobox picks an option', async () => {
    const onChange = vi.fn<(value: string | null) => void>()
    const user = userEvent.setup()
    render(
      <Combobox
        options={[
          { label: 'Spain', value: 'ES' },
          { label: 'Kenya', value: 'KE' }
        ]}
        onChange={onChange}
        placeholder='Country'
      />
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Kenya' }))
    expect(onChange).toHaveBeenCalledWith('KE')
  })

  it('Select opens and picks an item', async () => {
    const onValueChange = vi.fn<(value: string) => void>()
    const user = userEvent.setup()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label='Unit'>
          <SelectValue placeholder='Pick a unit' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ha'>Hectares</SelectItem>
          <SelectItem value='km2'>Square km</SelectItem>
        </SelectContent>
      </Select>
    )
    await user.click(screen.getByRole('combobox', { name: 'Unit' }))
    await user.click(await screen.findByRole('option', { name: 'Hectares' }))
    expect(onValueChange).toHaveBeenCalledWith('ha')
  })

  it('Calendar renders a month and selects a day', async () => {
    const onSelect = vi.fn<(date: Date | undefined) => void>()
    const user = userEvent.setup()
    render(<Calendar mode='single' defaultMonth={new Date(2026, 10, 1)} onSelect={onSelect} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /November 4th, 2026/ }))
    expect(onSelect).toHaveBeenCalled()
  })

  it('Alert and Loading render with roles', () => {
    render(
      <>
        <Alert variant='destructive'>
          <AlertTitle>Could not save</AlertTitle>
          <AlertDescription>Try again</AlertDescription>
        </Alert>
        <Loading label='Loading sites' />
        <Loading visible={false} label='Hidden' />
      </>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save')
    expect(screen.getByRole('status')).toHaveTextContent('Loading sites')
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
  })

  it('Toaster shows a toast', async () => {
    render(<Toaster />)
    act(() => {
      toast.success('Site saved')
    })
    expect(await screen.findByText('Site saved')).toBeInTheDocument()
  })

  it('typography exports the same names as styles/typography.js', () => {
    expect(Object.keys(Typography).sort()).toEqual(
      [
        'ErrorText',
        'H2',
        'H4',
        'ItemSubTitle',
        'ItemTitle',
        'Link',
        'LinkLooksLikeButtonPrimary',
        'LinkLooksLikeButtonSecondary',
        'PageSubtitle',
        'PageTitle',
        'SmallUpperCase',
        'TextSmall'
      ].sort()
    )
    render(
      <>
        <Typography.PageTitle>Sites</Typography.PageTitle>
        <Typography.Link href='/about'>About</Typography.Link>
      </>
    )
    expect(screen.getByRole('heading', { level: 1, name: 'Sites' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  })
})
