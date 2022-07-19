import { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, MenuItem, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'
import { ErrorText } from '../../styles/typography'

const CustomAddTabularInputRow = ({ saveMeasurementItem, updateTabularInputDisplay }) => {
  const [type, setType] = useState('')
  const [number, setNumber] = useState(0)
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
    const measurementItem = { type, number, source, purpose: { purpose, other } }
    if (!type || !number || !source || !purpose) {
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
            value={number}
            label='number'
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
  margin-top: 1em;
`

const SectionDiv = styled('div')`
  margin-top: 2em;
`

const sourceOptions = ['Nursery', 'Wild', 'Both']

const purposeOptions = [
  'Coastal defence',
  'Source of food',
  'Products for sale',
  'Traditional medicines',
  'Other',
  'Not applicable'
]

export default CustomAddTabularInputRow
