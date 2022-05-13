import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useState } from 'react'
import language from '../../language'

const getValueToReturn = ({ nonOtherSelectedValues, otherInputValue, isOtherChecked }) => {
  const valueToReturn = { selectedValues: nonOtherSelectedValues ?? [] }
  if (isOtherChecked) {
    valueToReturn.otherValue = otherInputValue
    valueToReturn.isOtherChecked = true //we're being explicit here for the sake of composing code not having to use empty strings vs undefined to differentiate between checked and unchecked for validation for example.
  }

  return valueToReturn
}

const CheckboxGroup = forwardRef(
  ({ id, onBlur, onChange, options, shouldAddOtherOptionWithClarification, value }, ref) => {
    const [nonOtherSelectedValues, setNonOtherSelectedValues] = useState([])
    const [otherInputValue, setOtherInputValue] = useState(value?.otherValue ?? '')
    const [isOtherChecked, setIsOtherChecked] = useState(!!value?.otherValue)

    const _loadNonOtherSelectedValues = useEffect(() => {
      setNonOtherSelectedValues(value?.selectedValues ?? [])
    }, [value?.selectedValues])

    const handleOtherCheckboxChange = () => {
      const isOtherCheckedNewState = !isOtherChecked
      setIsOtherChecked(isOtherCheckedNewState)
      onChange(
        getValueToReturn({
          nonOtherSelectedValues,
          otherInputValue,
          isOtherChecked: isOtherCheckedNewState
        })
      )
    }
    const handleOtherTextInputChange = (event) => {
      const {
        target: { value }
      } = event
      setOtherInputValue(value)
      onChange(
        getValueToReturn({
          nonOtherSelectedValues,
          otherInputValue: value,
          isOtherChecked
        })
      )
    }
    const handleNonOtherCheckboxChange = (itemValue) => {
      const updateNonOtherSelectedValues = [...nonOtherSelectedValues]
      const foundItemIndex = updateNonOtherSelectedValues.indexOf(itemValue)

      if (foundItemIndex > -1) {
        updateNonOtherSelectedValues.splice(foundItemIndex, 1)
      } else {
        updateNonOtherSelectedValues.push(itemValue)
      }

      setNonOtherSelectedValues(updateNonOtherSelectedValues)
      onChange(
        getValueToReturn({
          nonOtherSelectedValues: updateNonOtherSelectedValues,
          otherInputValue,
          isOtherChecked
        })
      )
    }

    const nonOtherCheckboxInputs = options.map((item) => (
      <div key={item.value}>
        <FormControlLabel
          control={
            <Checkbox
              id={`${id}-${item.value}`}
              value={item.value}
              checked={nonOtherSelectedValues.includes(item.value)}
              onChange={() => {
                handleNonOtherCheckboxChange(item.value)
              }}
              onBlur={onBlur}
            />
          }
          label={item.label}
        />
      </div>
    ))

    return (
      <FormGroup ref={ref}>
        {nonOtherCheckboxInputs}
        {shouldAddOtherOptionWithClarification ? (
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOtherChecked}
                  onChange={handleOtherCheckboxChange}
                  onBlur={onBlur}
                />
              }
              label={language.form.checkboxGroupOtherLabel}
            />
            {isOtherChecked ? (
              <TextField
                label={language.form.checkboxGroupOtherInputPlaceholder}
                variant='outlined'
                onChange={handleOtherTextInputChange}
                value={otherInputValue}
              />
            ) : null}
          </div>
        ) : null}
      </FormGroup>
    )
  }
)

CheckboxGroup.displayName = 'Checkbox Group'
CheckboxGroup.propTypes = {
  id: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  shouldAddOtherOptionWithClarification: PropTypes.bool,
  value: PropTypes.shape({
    selectedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    otherValue: PropTypes.string
  })
}

CheckboxGroup.defaultProps = {
  onBlur: () => {},
  shouldAddOtherOptionWithClarification: false
}

export default CheckboxGroup
