import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'

const AddTabularInputRow = ({ saveMeasurementItem, updateTabularInputDisplay }) => {
  const [measurementType, setMeasurementType] = useState('')
  const [measurementValue, setMeasurementValue] = useState('')
  const [measurementUnit, setMeasurementUnit] = useState('')
  const [error, setError] = useState(null)

  const cancelMeasurementItem = () => {
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
    <SectionDiv>
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
        <ButtonsDiv>
          <Button variant='outlined' onClick={handleSave} sx={{ marginRight: '0.5em' }}>
            Save
          </Button>
          <Button
            variant='outlined'
            color='error'
            onClick={cancelMeasurementItem}
            sx={{ marginLeft: '0.5em' }}>
            Cancel
          </Button>
        </ButtonsDiv>
      </Box>
    </SectionDiv>
  )
}

AddTabularInputRow.propTypes = {
  saveMeasurementItem: PropTypes.func.isRequired,
  updateTabularInputDisplay: PropTypes.func.isRequired
}

const ButtonsDiv = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1.5em;
`

const SectionDiv = styled('div')`
  margin-top: 2em;
`

export default AddTabularInputRow
