import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'

import ButtonDeleteForm from '@/components/ButtonDeleteForm'
import ButtonSave from '@/components/ButtonSave'
import ConfirmPrompt from '@/components/ConfirmPrompt/ConfirmPrompt'
import DatePickerUtc from '@/components/DatePickerUtc'
import FormValidationMessageIfErrors from '@/components/FormValidationMessageIfErrors'
import { FormInput, FormRadioGroup, FormSelect } from '@/components/form/FormInput'
import RequiredIndicator from '@/components/RequiredIndicator'
import TabularButtons from '@/components/TabularInput/TabularButtons'

// jsdom lacks the layout APIs Base UI's floating popups call.
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  Element.prototype.scrollIntoView ??= () => {}
})

function WithForm({
  children,
  defaultValues = {}
}: {
  children: ReactNode
  defaultValues?: Record<string, unknown>
}) {
  const form = useForm({ defaultValues })
  return <FormProvider {...form}>{children}</FormProvider>
}

describe('shared form primitives', () => {
  it('DatePickerUtc emits the picked day at UTC midnight', async () => {
    const onChange = vi.fn<(value: string | null) => void>()
    const user = userEvent.setup()
    render(
      <DatePickerUtc
        id='start'
        label='Start date'
        field={{ value: '2026-11-02T00:00:00.000Z', onChange }}
      />
    )

    const trigger = screen.getByRole('button', { name: 'Start date' })
    expect(trigger).toHaveTextContent('2026/11/02')

    await user.click(trigger)
    await user.click(await screen.findByRole('button', { name: /November 4th, 2026/ }))
    expect(onChange).toHaveBeenCalledWith('2026-11-04T00:00:00.000Z')
  })

  it('DatePickerUtc shows a legacy offset value on the same day', () => {
    render(
      <DatePickerUtc
        label='Start date'
        field={{ value: '2024-03-05T00:00:00.000+01:00', onChange: () => {} }}
      />
    )
    expect(screen.getByRole('button', { name: 'Start date' })).toHaveTextContent('2024/03/05')
    expect(screen.getByText('Dates are UTC')).toBeInTheDocument()
  })

  it('ConfirmPrompt confirms and cancels', async () => {
    const onConfirm = vi.fn<() => void>()
    const setIsOpen = vi.fn<(isOpen: boolean) => void>()
    const user = userEvent.setup()
    render(
      <ConfirmPrompt
        isOpen
        setIsOpen={setIsOpen}
        title='Delete row?'
        promptText='This cannot be undone.'
        confirmButtonText='Delete'
        onConfirm={onConfirm}
      />
    )

    expect(screen.getByRole('alertdialog', { name: 'Delete row?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(setIsOpen).toHaveBeenCalledWith(false, expect.anything())
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('FormInput reads control from context and shows the field error', async () => {
    function LoginLike() {
      const form = useForm({ defaultValues: { email: '' } })
      return (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(() => {})}
            onReset={() => form.setError('email', { message: 'Email required' })}>
            <FormInput name='email' label='Email' type='email' required />
            <button type='reset'>Fail</button>
          </form>
        </FormProvider>
      )
    }
    const user = userEvent.setup()
    render(<LoginLike />)

    const input = screen.getByLabelText(/Email/)
    expect(input).toHaveAttribute('type', 'email')
    await user.type(input, 'a@b.co')
    expect(input).toHaveValue('a@b.co')

    await user.click(screen.getByRole('button', { name: 'Fail' }))
    expect(await screen.findByText('Email required')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('FormSelect and FormRadioGroup write to the form', async () => {
    const user = userEvent.setup()
    let values: Record<string, unknown> = {}
    function Fields() {
      const form = useForm({ defaultValues: { unit: '', tenure: '' } })
      values = useWatch({ control: form.control })
      return (
        <FormProvider {...form}>
          <FormSelect
            name='unit'
            label='Unit'
            placeholder='Pick a unit'
            options={[
              { label: 'Hectares', value: 'ha' },
              { label: 'Square km', value: 'km2' }
            ]}
          />
          <FormRadioGroup
            name='tenure'
            label='Tenure'
            options={[
              { label: 'Public', value: 'public' },
              { label: 'Private', value: 'private' }
            ]}
          />
        </FormProvider>
      )
    }
    render(<Fields />)

    await user.click(screen.getByRole('combobox', { name: 'Unit' }))
    await user.click(await screen.findByRole('option', { name: 'Hectares' }))
    await waitFor(() => expect(values.unit).toBe('ha'))
    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveTextContent('Hectares')

    expect(screen.getByRole('radiogroup', { name: 'Tenure' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Private' }))
    await waitFor(() => expect(values.tenure).toBe('private'))
  })

  it('buttons, required indicator and validation banner render', async () => {
    const handleSave = vi.fn<() => void>()
    const cancelItem = vi.fn<() => void>()
    const user = userEvent.setup()
    render(
      <WithForm>
        <ButtonSave isSaving={false} />
        <ButtonSave isSaving />
        <ButtonDeleteForm isDeleting />
        <TabularButtons handleSave={handleSave} cancelItem={cancelItem} />
        <RequiredIndicator />
        <FormValidationMessageIfErrors
          formErrors={{ name: { type: 'required', message: 'Required' } }}
        />
        <FormValidationMessageIfErrors formErrors={{}} />
      </WithForm>
    )

    const [buttonSave, tabularSave] = screen.getAllByRole('button', { name: 'Save' })
    expect(buttonSave).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()

    await user.click(tabularSave!)
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(handleSave).toHaveBeenCalledOnce()
    expect(cancelItem).toHaveBeenCalledOnce()

    expect(screen.getByLabelText('Indicates required field')).toHaveTextContent('*')
    expect(screen.getAllByRole('alert')).toHaveLength(1)
  })
})
