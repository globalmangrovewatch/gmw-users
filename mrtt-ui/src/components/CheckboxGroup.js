import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useState } from 'react'

const CheckboxGroup = forwardRef(({ options, value, onChange, onBlur }, ref) => {
  const [checkboxItems, setCheckboxItems] = useState([])

  const _loadCheckboxItems = useEffect(() => {
    setCheckboxItems(value)
  }, [value])

  const handleCheckboxGroupChange = ({ itemValue, event }) => {
    const updateCheckboxItems = [...checkboxItems]
    const foundItemIndex = updateCheckboxItems.indexOf(itemValue)

    if (foundItemIndex > -1) {
      updateCheckboxItems.splice(foundItemIndex, 1)
    } else {
      updateCheckboxItems.push(itemValue)
    }

    setCheckboxItems(updateCheckboxItems)
    onChange({ selectedItems: updateCheckboxItems, event })
  }

  const checkboxes = options.map((item) => (
    <div key={item.value}>
      <FormControlLabel
        control={
          <Checkbox
            id={item.value}
            value={item.value}
            checked={checkboxItems.includes(item.value)}
            onChange={(event) => handleCheckboxGroupChange({ itemValue: item.value, event })}
            onBlur={onBlur}
          />
        }
        label={item.label}
      />
    </div>
  ))

  return <FormGroup ref={ref}>{checkboxes}</FormGroup>
})

CheckboxGroup.displayName = 'Checkbox Group'
CheckboxGroup.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
}

CheckboxGroup.defaultProps = { onBlur: () => {} }

export default CheckboxGroup
