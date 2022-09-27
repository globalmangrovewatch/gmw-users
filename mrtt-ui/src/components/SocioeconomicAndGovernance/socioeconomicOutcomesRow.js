import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'

import { TabularSectionDiv, TabularLabel, TabularInputSection } from '../../styles/forms'
import {
  ComparisonOptions,
  TrendOptions,
  TypeOptions
} from '../../data/socioeconomicOutcomesOptions'
import { ErrorText } from '../../styles/typography'

const SocioeconomicOutcomesRow = ({
  outcome,
  type,
  trend,
  linkedAims,
  measurement,
  unit,
  comparison,
  value,
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

  const [initialMeasurement, setInitialMeasurement] = useState('')
  const [currentMeasurement, setCurrentMeasurement] = useState('')

  const [initialUnit, setInitialUnit] = useState('')
  const [currentUnit, setCurrentUnit] = useState('')

  const [initialComparison, setInitialComparison] = useState('')
  const [currentComparison, setCurrentComparison] = useState('')

  const [initialValue, setInitialValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')

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
    if (currentMeasurement !== initialMeasurement) {
      updateItem({ index, currentMeasurement })
    }
    if (currentUnit !== initialUnit) {
      updateItem({ index, currentUnit })
    }
    if (currentComparison !== initialComparison) {
      updateItem({ index, currentComparison })
    }
    if (currentValue !== initialValue) {
      updateItem({ index, currentValue })
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
    if (measurement) {
      setCurrentMeasurement(measurement)
      setInitialMeasurement(measurement)
    }
    if (unit) {
      setCurrentUnit(unit)
      setInitialUnit(unit)
    }
    if (comparison) {
      setCurrentComparison(comparison)
      setInitialComparison(comparison)
    }
    if (value) {
      setCurrentValue(value)
      setInitialValue(value)
    }
  }, [comparison, linkedAims, measurement, trend, type, unit, value])

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
        {currentType === 'Quantitative' ? (
          <div>
            <TabularInputSection>
              <TabularLabel>Measurement</TabularLabel>
              <TextField
                value={currentMeasurement}
                label='Measurement'
                onChange={(e) => setCurrentMeasurement(e.target.value)}></TextField>
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>Unit</TabularLabel>
              <TextField
                value={currentUnit}
                label='unit'
                onChange={(e) => setCurrentUnit(e.target.value)}></TextField>
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>Comparison</TabularLabel>
              <TextField
                select
                sx={{ width: '12.9em' }}
                value={currentComparison}
                label='Comparison'
                onBlur={handleUpdate}
                onChange={(e) => setCurrentComparison(e.target.value)}>
                {ComparisonOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </TabularInputSection>
            <TabularInputSection>
              <TabularLabel>Value</TabularLabel>
              <TextField
                value={currentValue}
                label='Value'
                onChange={(e) => setCurrentValue(e.target.value)}></TextField>
            </TabularInputSection>
          </div>
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

SocioeconomicOutcomesRow.propTypes = {
  outcome: PropTypes.string.isRequired,
  type: PropTypes.string,
  trend: PropTypes.string,
  linkedAims: PropTypes.arrayOf(PropTypes.string),
  measurement: PropTypes.string,
  unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  comparison: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedAims: PropTypes.arrayOf(PropTypes.string),
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default SocioeconomicOutcomesRow
