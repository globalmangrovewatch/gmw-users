import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'

import { TabularSectionDiv, TabularLabel, TabularInputSection } from '../../styles/forms'
import {
  comparisonOptions,
  trendOptions,
  typeOptions
} from '../../data/socioeconomicOutcomesOptions'

const SocioeconomicOutcomesRow = ({
  outcome,
  type,
  trend,
  measurement,
  unit,
  comparison,
  value,
  index,
  updateItem
}) => {
  const [initialType, setInitialType] = useState('')
  const [currentType, setCurrentType] = useState('')

  const [initialTrend, setInitialTrend] = useState('')
  const [currentTrend, setCurrentTrend] = useState('')

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
  }, [comparison, measurement, trend, type, unit, value])

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
            {typeOptions.map((option, index) => (
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
              {trendOptions.map((option, index) => (
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
                {comparisonOptions.map((option, index) => (
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
      </Box>
    </TabularSectionDiv>
  )
}

SocioeconomicOutcomesRow.propTypes = {
  outcome: PropTypes.string.isRequired,
  type: PropTypes.string,
  trend: PropTypes.string,
  linkedAim: PropTypes.string,
  measurement: PropTypes.string,
  unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  comparison: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  deleteItem: PropTypes.func,
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default SocioeconomicOutcomesRow
