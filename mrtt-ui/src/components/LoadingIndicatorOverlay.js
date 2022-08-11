import { Backdrop, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

import { LoadingWrapper } from '../styles/containers'
import theme from '../styles/theme'

const LoadingIndicatorOverlay = ({ isVisible }) => {
  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isVisible}>
      <LoadingWrapper>
        <CircularProgress sx={{ color: theme.color.white }} />
      </LoadingWrapper>
    </Backdrop>
  )
}

LoadingIndicatorOverlay.propTypes = { isVisible: PropTypes.bool.isRequired }

export default LoadingIndicatorOverlay
