import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, TextField } from '@mui/material'
// import * as yup from 'yup'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'

const AddTabularInputRow = ({ saveMeasurementItem, updateTabularInputDisplay }) => {
  const [measurementType, setMeasurementType] = useState('')
  const [measurementValue, setMeasurementValue] = useState('')
  const [error, setError] = useState(null)

  const cancelMeasurementItem = () => {
    setMeasurementType(null)
    setMeasurementValue(null)
    updateTabularInputDisplay(false)
  }

  const handleSave = () => {
    if (!measurementType.length || !measurementValue.length) {
      setError('Please fill both fields.')
    } else {
      saveMeasurementItem(measurementType, measurementValue)
      updateTabularInputDisplay(false)
    }
  }

  return (
    <TabularInputSection>
      <Box>
        <TabularInputSection>
          <TabularLabel>Measurement type</TabularLabel>
          <TextField
            value={measurementType}
            label='type'
            onChange={(e) => setMeasurementType(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Measurement value</TabularLabel>
          <TextField
            value={measurementValue}
            label='value'
            onChange={(e) => setMeasurementValue(e.target.value)}></TextField>
        </TabularInputSection>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button variant='outlined' onClick={handleSave}>
          Save
        </Button>
        <Button variant='outlined' color='error' onClick={cancelMeasurementItem}>
          Cancel
        </Button>
      </Box>
    </TabularInputSection>
  )
}

AddTabularInputRow.propTypes = {
  saveMeasurementItem: PropTypes.func.isRequired,
  updateTabularInputDisplay: PropTypes.func.isRequired
}

export default AddTabularInputRow
