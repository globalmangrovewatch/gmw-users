import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'

import CheckboxGroup from './CheckboxGroup'

const options = [
  { label: 'Option 1', value: 'Option 1' },
  { label: 'Option 2', value: 'Option 2' }
]

const checked = () =>
  screen
    .getAllByRole('checkbox')
    .filter((c) => c.checked)
    .map((c) => c.value)

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
    expect(checked()).toEqual(['Option 1', 'other'])
    expect(screen.getByDisplayValue('Else')).toBeInTheDocument()
  })

  it('reports the next value through onChange without keeping local state', () => {
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

    fireEvent.click(screen.getByLabelText('Option 2'))
    expect(onChange).toHaveBeenLastCalledWith({
      selectedValues: ['Option 1', 'Option 2'],
      isOtherChecked: false
    })

    fireEvent.click(screen.getByLabelText('Option 1'))
    // still controlled by the unchanged prop, so Option 1 is removed from the prop value
    expect(onChange).toHaveBeenLastCalledWith({ selectedValues: [], isOtherChecked: false })

    // nothing changed visually because the parent never updated `value`
    expect(checked()).toEqual(['Option 1'])
  })
})
