import React from 'react'
import language from '../language'
import { styled } from '@mui/system'
import theme from '../styles/theme'
import themeMui from '../styles/themeMui'

const RequiredIndicatorWrapper = styled('span')`
  color: ${theme.form.requiredIndicatorColor};
  padding: 0 ${themeMui.spacing(1)};
`

const RequiredIndicator = () => {
  return (
    <RequiredIndicatorWrapper aria-label={language.form.requiredIndicator}>
      *
    </RequiredIndicatorWrapper>
  )
}

export default RequiredIndicator
