import React from 'react'
import { CircularProgress } from '@mui/material'
import { styled } from '@mui/system'

const LoadingWrapper = styled('div')`
  display: grid;
  height: 100vh;
  place-items: center;
`

const LoadingIndicator = () => {
  return (
    <LoadingWrapper>
      <CircularProgress />
    </LoadingWrapper>
  )
}

export default LoadingIndicator
