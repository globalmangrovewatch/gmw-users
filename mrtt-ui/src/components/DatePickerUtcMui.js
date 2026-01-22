import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Stack, TextField } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

import { TextSmall } from '../styles/typography'
import language from '../language'

const DatePickerUtcMui = (props) => {
  const value = DateTime.fromISO(props.field?.value)
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Stack spacing={3}>
        <TextSmall>{language.form.dateUtc}</TextSmall>
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
  field: PropTypes.shape({ onChange: PropTypes.func, value: PropTypes.instanceOf(DateTime) })
}

export default DatePickerUtcMui
