import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, TextField } from '@mui/material'

import { TabularInputSection, TabularLabel, TabularSectionDiv } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'
import TabularButtons from '../TabularInput/TabularButtons'

const AddProjectInterventionFundingRow = ({ saveMeasurementItem, updateTabularInputDisplay }) => {
  const [measurementType, setMeasurementType] = useState('')
  const [measurementValue, setMeasurementValue] = useState('')
  const [measurementUnit, setMeasurementUnit] = useState('')
  const [error, setError] = useState(null)

  const cancelItem = () => {
    setMeasurementType(null)
    setMeasurementValue(null)
    setMeasurementUnit(null)
    updateTabularInputDisplay(false)
  }

  const handleSave = () => {
    if (!measurementType.length || !measurementValue.length || !measurementUnit.length) {
      setError('Please fill all fields.')
    } else {
      setMeasurementType(String(measurementType))
      saveMeasurementItem(measurementType, measurementValue, measurementUnit)
      updateTabularInputDisplay(false)
    }
  }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>Measurement type</TabularLabel>
          <TextField
            value={measurementType}
            label='type'
            onChange={(e) => setMeasurementType(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Value</TabularLabel>
          <TextField
            value={measurementValue}
            label='value'
            onChange={(e) => setMeasurementValue(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Unit</TabularLabel>
          <TextField
            value={measurementUnit}
            label='unit'
            onChange={(e) => setMeasurementUnit(e.target.value)}></TextField>
        </TabularInputSection>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <TabularButtons handleSave={handleSave} cancelItem={cancelItem}></TabularButtons>
      </Box>
    </TabularSectionDiv>
  )
}

AddProjectInterventionFundingRow.propTypes = {
  saveMeasurementItem: PropTypes.func.isRequired,
  updateTabularInputDisplay: PropTypes.func.isRequired
}

export default AddProjectInterventionFundingRow
