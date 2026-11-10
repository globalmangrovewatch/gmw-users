import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CheckboxGroup from './CheckboxGroup'

const options = [
  { label: 'Option 1', value: 'Option 1' },
  { label: 'Option 2', value: 'Option 2' }
]

// Checkboxes are role="checkbox" elements with aria-checked, so read them by accessible name.
const checked = () =>
  screen
    .getAllByRole('checkbox')
    .filter((c) => c.getAttribute('aria-checked') === 'true')
    .map((c) => c.textContent || c.closest('label')?.textContent)

describe('CheckboxGroup', () => {
  it('renders checked state straight from the value prop', () => {
    const { rerender } = render(
      <CheckboxGroup
        id='q'
        options={options}
        onChange={() => {}}
        shouldAddOtherOptionWithClarification
        value={{ selectedValues: ['Option 2'], isOtherChecked: false }}
      />
    )
    expect(checked()).toEqual(['Option 2'])

    rerender(
      <CheckboxGroup
        id='q'
        options={options}
        onChange={() => {}}
        shouldAddOtherOptionWithClarification
        value={{ selectedValues: ['Option 1'], isOtherChecked: true, otherValue: 'Else' }}
      />
    )
    expect(checked()).toEqual(['Option 1', 'Other'])
    expect(screen.getByDisplayValue('Else')).toBeInTheDocument()
  })

  it('reports the next value through onChange without keeping local state', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CheckboxGroup
        id='q'
        options={options}
        onChange={onChange}
        shouldAddOtherOptionWithClarification
        value={{ selectedValues: ['Option 1'], isOtherChecked: false }}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: 'Option 2' }))
    expect(onChange).toHaveBeenLastCalledWith({
      selectedValues: ['Option 1', 'Option 2'],
      isOtherChecked: false
    })

    await user.click(screen.getByRole('checkbox', { name: 'Option 1' }))
    // still controlled by the unchanged prop, so Option 1 is removed from the prop value
    expect(onChange).toHaveBeenLastCalledWith({ selectedValues: [], isOtherChecked: false })

    // nothing changed visually because the parent never updated `value`
    expect(checked()).toEqual(['Option 1'])
  })

  it('passes a checkbox-like event when shouldReturnEvent is set', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CheckboxGroup
        id='q'
        options={options}
        onChange={onChange}
        shouldReturnEvent
        value={{ selectedValues: [], isOtherChecked: false }}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: 'Option 2' }))
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ event: { target: { value: 'Option 2', checked: true } } })
    )
  })

  it('labels the group and shows the other input only when Other is checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <>
        <span id='q-label'>Protection status</span>
        <CheckboxGroup
          id='q'
          aria-labelledby='q-label'
          options={options}
          onChange={onChange}
          shouldAddOtherOptionWithClarification
          value={{ selectedValues: [], isOtherChecked: false }}
        />
      </>
    )

    expect(screen.getByRole('group', { name: 'Protection status' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Other' }))
    expect(onChange).toHaveBeenLastCalledWith({
      selectedValues: [],
      isOtherChecked: true,
      otherValue: ''
    })
  })
})
