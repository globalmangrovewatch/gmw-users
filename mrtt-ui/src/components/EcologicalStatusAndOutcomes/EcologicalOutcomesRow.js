import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, TextField } from '@mui/material'

import { TabularSectionDiv, TabularLabel, TabularInputSection } from '../../styles/forms'
// import { TrendOptions, TypeOptions } from '../../data/socioeconomicOutcomesOptions'
// import { ErrorText } from '../../styles/typography'

const EcologicalOutcomesRow = ({
  index,
  mainLabel,
  secondaryLabel,
  indicator,
  metric,
  measurement,
  unit,
  comparison,
  updateItem
}) => {
  const [initialMeasurement, setInitialMeasurement] = useState('')
  const [currentMeasurement, setCurrentMeasurement] = useState('')

  const [initialUnit, setInitialUnit] = useState('')
  const [currentUnit, setCurrentUnit] = useState('')

  const [initialComparison, setInitialComparison] = useState([])
  const [currentComparison, setCurrentComparison] = useState([])

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
  }, [comparison, measurement, unit])

  //   const handleSelectedAimsOnChange = (event, aim) => {
  //     const linkedAimsCopy = [...currentLinkedAims]

  //     if (event.target.checked) {
  //       linkedAimsCopy.push(aim)
  //       setCurrentLinkedAims(linkedAimsCopy)
  //     } else {
  //       const aimIndex = linkedAimsCopy.findIndex((item) => item === aim)
  //       linkedAimsCopy.splice(aimIndex, 1)
  //       setCurrentLinkedAims(linkedAimsCopy)
  //     }
  //   }

  return (
    <TabularSectionDiv>
      <Box sx={{ width: '100%' }}>
        <TabularInputSection>
          <TabularLabel>{`${mainLabel}: ${secondaryLabel}`}</TabularLabel>
          <TabularLabel>{`${indicator}: ${metric}`}</TabularLabel>
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

        {/* <TabularInputSection>
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
        </TabularInputSection> */}
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
  updateItem: PropTypes.func.isRequired
}

export default EcologicalOutcomesRow
