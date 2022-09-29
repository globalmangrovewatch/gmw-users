import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'

import { TabularSectionDiv, TabularLabel, TabularInputSection } from '../../styles/forms'
import { TrendOptions, TypeOptions } from '../../data/socioeconomicOutcomesOptions'
import { ErrorText } from '../../styles/typography'

const EcologicalOutcomesRow = ({
  outcome,
  type,
  trend,
  linkedAims,
  selectedAims,
  index,
  updateItem
}) => {
  const [initialType, setInitialType] = useState('')
  const [currentType, setCurrentType] = useState('')

  const [initialTrend, setInitialTrend] = useState('')
  const [currentTrend, setCurrentTrend] = useState('')

  const [initialLinkedAims, setInitialLinkedAims] = useState([])
  const [currentLinkedAims, setCurrentLinkedAims] = useState([])

  const handleUpdate = () => {
    if (currentType !== initialType) {
      updateItem({ index, currentType })
    }
    if (currentTrend !== initialTrend) {
      updateItem({ index, currentTrend })
    }
    if (currentLinkedAims !== initialLinkedAims) {
      updateItem({ index, currentLinkedAims })
    }
  }

  const _setFormValues = useEffect(() => {
    if (type) {
      setCurrentType(type)
      setInitialType(type)
    }
    if (trend) {
      setCurrentTrend(trend)
      setInitialTrend(trend)
    }
    if (linkedAims) {
      setCurrentLinkedAims(linkedAims)
      setInitialLinkedAims(linkedAims)
    }
  }, [linkedAims, trend, type])

  const handleSelectedAimsOnChange = (event, aim) => {
    const linkedAimsCopy = [...currentLinkedAims]

    if (event.target.checked) {
      linkedAimsCopy.push(aim)
      setCurrentLinkedAims(linkedAimsCopy)
    } else {
      const aimIndex = linkedAimsCopy.findIndex((item) => item === aim)
      linkedAimsCopy.splice(aimIndex, 1)
      setCurrentLinkedAims(linkedAimsCopy)
    }
  }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>{outcome}</TabularLabel>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Type</TabularLabel>
          <TextField
            select
            sx={{ width: '12.9em' }}
            value={currentType}
            label='Type'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentType(e.target.value)}>
            {TypeOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </TabularInputSection>
        {currentType === 'Observed' ? (
          <TabularInputSection>
            <TabularLabel>Trend</TabularLabel>
            <TextField
              select
              sx={{ width: '12.9em' }}
              value={currentTrend}
              label='Trend'
              onBlur={handleUpdate}
              onChange={(e) => setCurrentTrend(e.target.value)}>
              {TrendOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </TabularInputSection>
        ) : null}

        <TabularInputSection>
          <TabularLabel>Link outcome to aims</TabularLabel>
          {selectedAims.length > 0 ? (
            <List>
              {selectedAims.map((aim, index) => (
                <ListItem key={index}>
                  <Box>
                    <Box>
                      <Checkbox
                        value={aim}
                        checked={currentLinkedAims.includes(aim)}
                        onBlur={handleUpdate}
                        onChange={(event) => handleSelectedAimsOnChange(event, aim)}></Checkbox>
                      <Typography variant='subtitle'>{aim}</Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <ErrorText>Please select aims in 3.2</ErrorText>
          )}
        </TabularInputSection>
      </Box>
    </TabularSectionDiv>
  )
}

EcologicalOutcomesRow.propTypes = {
  outcome: PropTypes.string.isRequired,
  type: PropTypes.string,
  trend: PropTypes.string,
  linkedAims: PropTypes.arrayOf(PropTypes.string),
  selectedAims: PropTypes.arrayOf(PropTypes.string),
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default EcologicalOutcomesRow
