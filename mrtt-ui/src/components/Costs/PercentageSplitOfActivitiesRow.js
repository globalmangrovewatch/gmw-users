import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Box, TextField } from '@mui/material'

import { TabularLabel, VerticalTabularBox, VerticalTabularInputSection } from '../../styles/forms'

const PercentageSplitOfActivitiesRow = ({ label, percentage, index, updateItem }) => {
  const [initialPercentage, setInitialPercentage] = useState('')
  const [currentPercentage, setCurrentPercentage] = useState('')

  const handleUpdate = () => {
    if (currentPercentage !== initialPercentage) {
      updateItem(index, currentPercentage)
    }
  }

  const _setFormValues = useEffect(() => {
    if (percentage) {
      setCurrentPercentage(percentage)
      setInitialPercentage(percentage)
    }
  }, [percentage])

  return (
    <VerticalTabularInputSection>
      <VerticalTabularBox>
        <TabularLabel>{label}</TabularLabel>
        <Box>
          <TextField
            sx={{ marginTop: '1em', width: '8em' }}
            value={currentPercentage}
            label='percentage'
            onBlur={handleUpdate}
            onChange={(e) => setCurrentPercentage(e.target.value)}></TextField>
        </Box>
      </VerticalTabularBox>
    </VerticalTabularInputSection>
  )
}

PercentageSplitOfActivitiesRow.propTypes = {
  label: PropTypes.string.isRequired,
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default PercentageSplitOfActivitiesRow
