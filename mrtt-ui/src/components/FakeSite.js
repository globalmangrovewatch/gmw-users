import { Link, Stack, Typography } from '@mui/material'
import { Link as LinkReactRouter } from 'react-router-dom'
import React from 'react'

const FakeSite = () => {
  return (
    <Stack>
      <Typography variant='h4'>Fake Site for Demo</Typography>
      <Link component={LinkReactRouter} to='/1/form/project-details'>
        Project Details
      </Link>
      <Link component={LinkReactRouter} to='/1/form/restoration-aims'>
        Restoration Aims
      </Link>
    </Stack>
  )
}

export default FakeSite
