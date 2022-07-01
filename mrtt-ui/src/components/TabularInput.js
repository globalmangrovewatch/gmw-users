import React from 'react'
import PropTypes from 'prop-types'
import { Controller } from 'react-hook-form'
import { TextField } from '@mui/material'
import { TabularInputSection, TabularLabel } from '../styles/forms'

const TabularInput = ({ control, label, controlName }) => {
  return (
    <TabularInputSection>
      <TabularLabel>{label}</TabularLabel>
      <Controller
        name={controlName}
        control={control}
        defaultValue={''}
        render={({ field }) => <TextField {...field} value={field.value} label='value'></TextField>}
      />
    </TabularInputSection>
  )
}

TabularInput.propTypes = {
  control: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  controlName: PropTypes.string.isRequired
}

export default TabularInput
