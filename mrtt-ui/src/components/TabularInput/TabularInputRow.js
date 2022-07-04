import React from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { TextField } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import { TabularInputSection, TabularLabel } from '../../styles/forms'

const TabularInputRow = ({ control, label, value, index, controlName, deleteMeasurementItem }) => {
  const handleDelete = () => {
    deleteMeasurementItem(index)
  }
  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <TabularBox>
        <Controller
          name={controlName}
          control={control}
          defaultValue={''}
          render={({ field }) => (
            // still buggy, still  looking into it
            <TextField {...field} value={field.value}>
              {value}
            </TextField>
          )}
        />
        <Delete onClick={handleDelete} sx={{ marginLeft: '0.5em' }}></Delete>
      </TabularBox>
    </TabularInputSection>
  )
}

TabularInputRow.propTypes = {
  control: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  controlName: PropTypes.string.isRequired,
  deleteMeasurementItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export const TabularBox = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`

export default TabularInputRow
