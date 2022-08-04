import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'

import { VerticalTabularBox, TabularInputSection, TabularLabel } from '../../styles/forms'

const PhysicalMeasurementRow = ({ label, value, unit, index, deleteItem, updateItem }) => {
  const [initialValue, setInitialValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [initialUnit, setInitialUnit] = useState('')
  const [currentUnit, setCurrentUnit] = useState('')
  const handleDelete = () => {
    deleteItem(index)
  }

  const handleUpdate = () => {
    if (currentValue !== initialValue || currentUnit !== initialUnit) {
      updateItem(index, currentValue, currentUnit)
    }
  }

  const _setFormValues = useEffect(() => {
    if (value) {
      setCurrentValue(value)
      setInitialValue(value)
    }
    if (unit) {
      setCurrentUnit(unit)
      setInitialUnit(unit)
    }
  }, [value, unit])

  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <VerticalTabularBox>
        <TextField
          value={currentValue}
          label='value'
          onBlur={handleUpdate}
          onChange={(e) => setCurrentValue(e.target.value)}></TextField>
        <TextField
          sx={{ width: '8em', marginLeft: '0.5em' }}
          value={currentUnit}
          label='unit'
          onBlur={handleUpdate}
          onChange={(e) => setCurrentUnit(e.target.value)}></TextField>
        <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em' }}></Delete>
      </VerticalTabularBox>
    </TabularInputSection>
  )
}

PhysicalMeasurementRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default PhysicalMeasurementRow
