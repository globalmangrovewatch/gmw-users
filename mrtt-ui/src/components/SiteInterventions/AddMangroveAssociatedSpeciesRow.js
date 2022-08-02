import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'

import { TabularInputSection, TabularLabel, TabularSectionDiv } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'
import { sourceOptions, purposeOptions } from '../../data/siteInterventionOptions'
import TabularButtons from '../TabularInput/TabularButtons'

const AddMangroveAssociatedSpeciesRow = ({ saveItem, updateTabularInputDisplay }) => {
  const [type, setType] = useState('')
  const [count, setNumber] = useState(0)
  const [source, setSource] = useState('')
  const [purpose, setPurpose] = useState('')
  const [other, setOther] = useState('')
  const [error, setError] = useState(null)

  const cancelItem = () => {
    setType(null)
    setNumber(null)
    setSource(null)
    setPurpose(null)
    setOther(null)
    updateTabularInputDisplay(false)
  }

  const handleSave = () => {
    const item = { type, count, source, purpose: { purpose, other } }

    if (!type || !count || !source || !purpose) {
      setError('Please fill all fields.')
    } else {
      setType(String(type))
      saveItem(item)
      updateTabularInputDisplay(false)
    }
  }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>Species type</TabularLabel>
          <TextField
            value={type}
            label='type'
            onChange={(e) => setType(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Number</TabularLabel>
          <TextField
            value={count}
            label='count'
            onChange={(e) => setNumber(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Source</TabularLabel>
          <TextField
            select
            value={source}
            label='source'
            sx={{ width: '12.9em' }}
            onChange={(e) => setSource(e.target.value)}>
            {sourceOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Purpose</TabularLabel>
          <TextField
            select
            value={purpose}
            label='purpose'
            sx={{ width: '12.9em' }}
            onChange={(e) => setPurpose(e.target.value)}>
            {purposeOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </TabularInputSection>
        {purpose === 'Other' ? (
          <TabularInputSection>
            <TabularLabel>Other purpose</TabularLabel>
            <TextField
              value={other}
              label='please specify'
              onChange={(e) => setOther(e.target.value)}></TextField>
          </TabularInputSection>
        ) : null}
        {error ? <ErrorText>{error}</ErrorText> : null}

        <TabularButtons handleSave={handleSave} cancelItem={cancelItem}></TabularButtons>
      </Box>
    </TabularSectionDiv>
  )
}

AddMangroveAssociatedSpeciesRow.propTypes = {
  saveItem: PropTypes.func.isRequired,
  updateTabularInputDisplay: PropTypes.func.isRequired
}

export default AddMangroveAssociatedSpeciesRow
