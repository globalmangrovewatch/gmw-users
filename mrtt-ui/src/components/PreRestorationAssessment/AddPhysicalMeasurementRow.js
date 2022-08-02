import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, TextField } from '@mui/material'

import { TabularInputSection, TabularLabel, TabularSectionDiv } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'
import TabularButtons from '../TabularInput/TabularButtons'

const AddPhysicaMeasurementRow = ({ saveItem, updateTabularInputDisplay }) => {
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('')
  const [error, setError] = useState(null)

  const cancelItem = () => {
    setType(null)
    setValue(null)
    setUnit(null)
    updateTabularInputDisplay(false)
  }

  const handleSave = () => {
    if (!type.length || !value.length || !unit.length) {
      setError('Please fill all fields.')
    } else {
      setType(String(type))
      saveItem(type, value, unit)
      updateTabularInputDisplay(false)
    }
  }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>Measurement type</TabularLabel>
          <TextField
            value={type}
            label='type'
            onChange={(e) => setType(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Value</TabularLabel>
          <TextField
            value={value}
            label='value'
            onChange={(e) => setValue(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Unit</TabularLabel>
          <TextField
            value={unit}
            label='unit'
            onChange={(e) => setUnit(e.target.value)}></TextField>
        </TabularInputSection>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <TabularButtons handleSave={handleSave} cancelItem={cancelItem}></TabularButtons>
      </Box>
    </TabularSectionDiv>
  )
}

AddPhysicaMeasurementRow.propTypes = {
  saveItem: PropTypes.func.isRequired,
  updateTabularInputDisplay: PropTypes.func.isRequired
}

export default AddPhysicaMeasurementRow
