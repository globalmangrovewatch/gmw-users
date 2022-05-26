import { action } from '@storybook/addon-actions'
import CheckboxGroup from './CheckboxGroup'
import React from 'react'

export default {
  title: 'CheckboxGroup',
  component: CheckboxGroup
}
const options = [
  { label: 'Option 1', value: 'Option 1' },
  { label: 'Option 2', value: 'Option 2' },
  { label: 'Option 3', value: 'Option 3' }
]

export const Basic = () => (
  <CheckboxGroup
    options={options}
    value={{ selectedValues: [] }}
    onChange={action('onChange')}
    id='foo'
  />
)

export const OtherOptionWithClarification = () => (
  <CheckboxGroup
    id='bar'
    options={options}
    value={['']}
    onChange={action('onChange')}
    shouldAddOtherOptionWithClarification={true}
  />
)
export const OtherOptionPrePopulated = () => (
  <CheckboxGroup
    id='bar'
    options={options}
    value={{ selectedValues: ['Option 1', 'Option 2'], otherValue: 'Some other value' }}
    onChange={action('onChange')}
    shouldAddOtherOptionWithClarification={true}
  />
)

export const WithNestedMarkupForSelected = () => (
  <CheckboxGroup
    options={options}
    value={{ selectedValues: ['Option 1', 'Option 2'], otherValue: 'Some other value' }}
    onChange={action('onChange')}
    id='cuddlyKittens'
    shouldAddOtherOptionWithClarification={true}
    selectedMarkup={<>Youve selected ME</>}
  />
)
