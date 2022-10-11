import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Stack, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const DatePickerUtcMui = (props) => {
  const value = props.field?.value ? DateTime.fromISO(props.field?.value).setZone('UTC+0') : null
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack spacing={3}>
        <MobileDatePicker
          inputFormat='yyyy/MM/dd'
          onChange={(luxonDate) => {
            props.field?.onChange(luxonDate?.toISO())
          }}
          renderInput={(params) => <TextField {...params} />}
          value={value}
          {...props}
        />
      </Stack>
    </LocalizationProvider>
  )
}

DatePickerUtcMui.propTypes = {
  field: PropTypes.shape({ onChange: PropTypes.func, value: PropTypes.string })
}

export default DatePickerUtcMui
