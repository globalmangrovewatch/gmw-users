import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, Checkbox, List, ListItem, MenuItem, TextField, Typography } from '@mui/material'

import {
  NestedLabel1,
  NestedLabel3,
  TabularSectionDiv,
  TabularLabel,
  TabularInputSection
} from '../../styles/forms'
import { comparisonOptions } from '../../data/ecologicalOptions'
import { ErrorText } from '../../styles/typography'

const EcologicalOutcomesRow = ({
  index,
  mainLabel,
  secondaryLabel,
  indicator,
  metric,
  measurement,
  unit,
  comparison,
  measurementComparison,
  linkedAims,
  selectedAims,
  updateItem
}) => {
  const [initialMeasurement, setInitialMeasurement] = useState('')
  const [currentMeasurement, setCurrentMeasurement] = useState('')

  const [initialUnit, setInitialUnit] = useState('')
  const [currentUnit, setCurrentUnit] = useState('')

  const [initialComparison, setInitialComparison] = useState('')
  const [currentComparison, setCurrentComparison] = useState('')

  const [initialMeasurementComparison, setInitialMeasurementComparison] = useState('')
  const [currentMeasurementComparison, setCurrentMeasurementComparison] = useState('')

  const [initialLinkedAims, setInitialLinkedAims] = useState([])
  const [currentLinkedAims, setCurrentLinkedAims] = useState([])

  const handleUpdate = () => {
    if (currentMeasurement !== initialMeasurement) {
      updateItem({ index, currentMeasurement })
    }
    if (currentUnit !== initialUnit) {
      updateItem({ index, currentUnit })
    }
    if (currentComparison !== initialComparison) {
      updateItem({ index, currentComparison })
    }
    if (currentMeasurementComparison !== initialMeasurementComparison) {
      updateItem({ index, currentMeasurementComparison })
    }
    if (currentLinkedAims !== initialLinkedAims) {
      updateItem({ index, currentLinkedAims })
    }
  }

  const _setFormValues = useEffect(() => {
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
    if (measurementComparison) {
      setCurrentMeasurementComparison(measurementComparison)
      setInitialMeasurementComparison(measurementComparison)
    }
    if (linkedAims) {
      setCurrentLinkedAims(linkedAims)
      setInitialLinkedAims(linkedAims)
    }
  }, [comparison, linkedAims, measurement, measurementComparison, unit])

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
          <NestedLabel1>{`${mainLabel}: ${secondaryLabel}`}</NestedLabel1>
        </TabularInputSection>
        <TabularInputSection>
          <NestedLabel3>{`${indicator}: ${metric}`}</NestedLabel3>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Measurement</TabularLabel>
          <TextField
            sx={{ width: '12.9em' }}
            value={currentMeasurement}
            label='Measurement'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentMeasurement(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Unit</TabularLabel>
          <TextField
            sx={{ width: '12.9em' }}
            value={currentUnit}
            label='Unit'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentUnit(e.target.value)}></TextField>
        </TabularInputSection>
        <TabularInputSection>
          <TabularLabel>Comparison</TabularLabel>
          <TextField
            sx={{ width: '12.9em' }}
            value={currentComparison}
            select
            label='Select'
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
          <TabularLabel>Measurement - Comparison</TabularLabel>
          <TextField
            sx={{ width: '12.9em' }}
            value={currentMeasurementComparison}
            label='Value'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentMeasurementComparison(e.target.value)}></TextField>
        </TabularInputSection>

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
            <ErrorText>Please select aims in 3.1</ErrorText>
          )}
        </TabularInputSection>
      </Box>
    </TabularSectionDiv>
  )
}

EcologicalOutcomesRow.propTypes = {
  index: PropTypes.number.isRequired,
  mainLabel: PropTypes.string.isRequired,
  secondaryLabel: PropTypes.string,
  indicator: PropTypes.string,
  metric: PropTypes.string,
  measurement: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  comparison: PropTypes.string,
  measurementComparison: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  linkedAims: PropTypes.arrayOf(PropTypes.string),
  selectedAims: PropTypes.arrayOf(PropTypes.string),
  updateItem: PropTypes.func.isRequired
}

export default EcologicalOutcomesRow
