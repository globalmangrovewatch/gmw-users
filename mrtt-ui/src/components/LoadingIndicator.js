import React from 'react'
import { CircularProgress } from '@mui/material'
import { styled } from '@mui/system'

const LoadingWrapper = styled('div')`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const LoadingIndicator = () => {
  return (
    <LoadingWrapper>
      <CircularProgress />
    </LoadingWrapper>
  )
}

export default LoadingIndicator
