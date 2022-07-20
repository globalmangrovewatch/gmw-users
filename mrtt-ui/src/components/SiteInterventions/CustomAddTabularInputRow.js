import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, MenuItem, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'
import { sourceOptions, purposeOptions } from '../../data/siteInterventionOptions'

const CustomAddTabularInputRow = ({ saveMeasurementItem, updateTabularInputDisplay }) => {
  const [type, setType] = useState('')
  const [count, setNumber] = useState(0)
  const [source, setSource] = useState('')
  const [purpose, setPurpose] = useState('')
  const [other, setOther] = useState('')
  const [error, setError] = useState(null)

  const cancelMeasurementItem = () => {
    setType(null)
    setNumber(null)
    setSource(null)
    setPurpose(null)
    setOther(null)
    updateTabularInputDisplay(false)
  }

  const handleSave = () => {
    const measurementItem = { type, count, source, purpose: { purpose, other } }
    if (!type || !count || !source || !purpose) {
      setError('Please fill all fields.')
    } else {
      setType(String(type))
      saveMeasurementItem(measurementItem)
      updateTabularInputDisplay(false)
    }
  }

  return (
    <SectionDiv>
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

CustomAddTabularInputRow.propTypes = {
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

export default CustomAddTabularInputRow
