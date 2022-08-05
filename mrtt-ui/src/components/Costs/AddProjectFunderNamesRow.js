import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'

import { TabularInputSection, TabularLabel, TabularSectionDiv } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'
import TabularButtons from '../TabularInput/TabularButtons'
import { costs as questions } from '../../data/questions'

const AddProjectFunderNamesRow = ({ saveItem, updateTabularInputDisplay }) => {
  const [funderName, setFunderName] = useState('')
  const [funderType, setFunderType] = useState('')
  const [percentage, setPercentage] = useState('')
  const [error, setError] = useState(null)

  const cancelItem = () => {
    setFunderName(null)
    setFunderType(null)
    setPercentage(null)
    updateTabularInputDisplay(false)
  }

  const handleSave = () => {
    if (!funderName.length || !funderType.length || !percentage.length) {
      setError('Please fill all fields.')
    } else {
      saveItem(funderName, funderType, percentage)
      updateTabularInputDisplay(false)
    }
  }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>Funder Name</TabularLabel>
          <TextField
            value={funderName}
            label='name'
            onChange={(e) => setFunderName(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Funder Type</TabularLabel>
          <TextField
            select
            value={funderType}
            label='type'
            sx={{ width: '12.9em' }}
            onChange={(e) => setFunderType(e.target.value)}>
            {questions.projectFunderNames.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Percentage</TabularLabel>
          <TextField
            value={percentage}
            label='%'
            onChange={(e) => setPercentage(e.target.value)}></TextField>
        </TabularInputSection>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <TabularButtons handleSave={handleSave} cancelItem={cancelItem}></TabularButtons>
      </Box>
    </TabularSectionDiv>
  )
}

AddProjectFunderNamesRow.propTypes = {
  saveItem: PropTypes.func.isRequired,
  updateTabularInputDisplay: PropTypes.func.isRequired
}

export default AddProjectFunderNamesRow
