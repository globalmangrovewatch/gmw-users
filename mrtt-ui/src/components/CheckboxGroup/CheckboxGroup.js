import { Checkbox, FormControlLabel, FormGroup, Stack, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef, useState } from 'react'
import language from '../../language'
import { makeValidClassName } from '../../library/strings/makeValidClassName'

const getValueToReturn = ({
  nonOtherSelectedValues,
  otherInputValue,
  isOtherChecked,
  event,
  shouldReturnEvent
}) => {
  const valueToReturn = { selectedValues: nonOtherSelectedValues ?? [] }
  valueToReturn.isOtherChecked = !!isOtherChecked //we're being explicit here for the sake of composing code not having to use empty strings vs undefined to differentiate between checked and unchecked for validation for example.
  if (isOtherChecked) {
    valueToReturn.otherValue = otherInputValue
  }
  if (shouldReturnEvent) {
    // react hook form doesnt like the event being attached to the value object if it handles onchange, so made a flag for when we are handling onchange manually and want to use the event
    valueToReturn.event = event
  }

  return valueToReturn
}

const CheckboxGroup = forwardRef(
  (
    {
      id,
      onBlur = () => {},
      onChange,
      options,
      optionsExcludedFromShowingSelectedMarkup = [],
      shouldAddOtherOptionWithClarification = false,
      value = [],
      SelectedMarkup = undefined,
      shouldReturnEvent = false
    },
    ref
  ) => {
    const [isOtherChecked, setIsOtherChecked] = useState(!!value?.isOtherChecked)
    const [nonOtherSelectedValues, setNonOtherSelectedValues] = useState(
      value?.selectedValues ?? []
    )
    const [otherInputValue, setOtherInputValue] = useState(value?.otherValue ?? '')

    const handleOtherCheckboxChange = (event) => {
      const isOtherCheckedNewState = !isOtherChecked
      setIsOtherChecked(isOtherCheckedNewState)
      onChange(
        getValueToReturn({
          nonOtherSelectedValues,
          otherInputValue,
          isOtherChecked: isOtherCheckedNewState,
          shouldReturnEvent,
          event
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
          isOtherChecked,
          shouldReturnEvent,
          event
        })
      )
    }
    const handleNonOtherCheckboxChange = ({ itemValue, event }) => {
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
          isOtherChecked,
          shouldReturnEvent,
          event
        })
      )
    }

    const nonOtherCheckboxInputs = options.map((option) => {
      const isChecked = nonOtherSelectedValues.includes(option.value)
      const optionId = makeValidClassName(`${id}-${option.value}`)
      const isInExcludeFromSelectedMarkupList = optionsExcludedFromShowingSelectedMarkup.includes(
        option.value
      )
      const isSelectedMarkupShowing =
        isChecked && SelectedMarkup && !isInExcludeFromSelectedMarkupList

      return (
        <Stack key={option.value}>
          <FormControlLabel
            control={
              <Checkbox
                id={optionId}
                value={option.value}
                checked={isChecked}
                onChange={(event) => {
                  handleNonOtherCheckboxChange({ itemValue: option.value, event })
                }}
                onBlur={onBlur}
              />
            }
            label={option.label}
          />
          {isSelectedMarkupShowing ? (
            <SelectedMarkup optionId={optionId} optionValue={option.value} />
          ) : null}
        </Stack>
      )
    })

    return (
      <FormGroup ref={ref}>
        {nonOtherCheckboxInputs}
        {shouldAddOtherOptionWithClarification ? (
          <Stack>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isOtherChecked}
                    onChange={handleOtherCheckboxChange}
                    onBlur={onBlur}
                    value='other'
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
            {isOtherChecked && SelectedMarkup ? (
              <SelectedMarkup optionId={`${id}-other`} optionValue='other' />
            ) : null}
          </Stack>
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
  optionsExcludedFromShowingSelectedMarkup: PropTypes.arrayOf(PropTypes.string),
  SelectedMarkup: PropTypes.oneOfType([PropTypes.node, PropTypes.any]), // we're doing partial application so this component can supply the selectedMarkup the optionId. Proptype complains about it being a function.
  shouldAddOtherOptionWithClarification: PropTypes.bool,
  shouldReturnEvent: PropTypes.bool,
  value: PropTypes.shape({
    selectedValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
    otherValue: PropTypes.string,
    isOtherChecked: PropTypes.bool
  })
}

export default CheckboxGroup
