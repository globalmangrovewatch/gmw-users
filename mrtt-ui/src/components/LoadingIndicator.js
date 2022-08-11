import React from 'react'
import { CircularProgress } from '@mui/material'

import { LoadingWrapper } from '../styles/containers'

const LoadingIndicator = () => {
  return (
    <LoadingWrapper>
      <CircularProgress />
    </LoadingWrapper>
  )
}

export default LoadingIndicator
