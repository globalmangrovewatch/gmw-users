import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'
import { Delete, Save } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'

const TabularInputRow = ({ label, value, index, deleteMeasurementItem, updateMeasurementItem }) => {
  const [initialVal, setInitialVal] = useState('')
  const [currentVal, setCurrentVal] = useState('')
  const handleDelete = () => {
    deleteMeasurementItem(index)
  }

  const handleUpdate = () => {
    updateMeasurementItem(index, currentVal)
  }

  useEffect(() => {
    if (value) {
      setCurrentVal(value)
      setInitialVal(value)
    }
  }, [value])

  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <TabularBox>
        <TextField value={currentVal} onChange={(e) => setCurrentVal(e.target.value)}></TextField>
        {currentVal !== initialVal ? (
          <Save onClick={handleUpdate} sx={{ marginLeft: '0.5em' }}></Save>
        ) : null}
        <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em' }}></Delete>
      </TabularBox>
    </TabularInputSection>
  )
}

TabularInputRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteMeasurementItem: PropTypes.func.isRequired,
  updateMeasurementItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export const TabularBox = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export default TabularInputRow
