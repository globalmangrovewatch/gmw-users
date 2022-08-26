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
    SelectedMarkup={() => <>Youve selected ME</>}
  />
)

export const WithNestedMarkupForSelectedIncludingExceptionsThatWontShowNestedMarkup = () => (
  <CheckboxGroup
    options={[
      { label: 'Show nested when selected 1', value: 'Show nested when selected 1' },
      { label: 'Show nested when selected 2', value: 'Show nested when selected 2' },
      { label: 'Dont show nested when selected 1', value: 'Dont show nested when selected 1' },
      { label: 'Dont show nested when selected 2', value: 'Dont show nested when selected 2' }
    ]}
    value={{
      selectedValues: [
        'Show nested when selected 1',
        'Show nested when selected 2',
        'Dont show nested when selected 1',
        'Dont show nested when selected 2'
      ]
    }}
    onChange={action('onChange')}
    id='cuddlyKittens'
    SelectedMarkup={() => <>Youve selected ME</>}
    optionsExcludedFromShowingSelectedMarkup={[
      'Dont show nested when selected 1',
      'Dont show nested when selected 2'
    ]}
  />
)
