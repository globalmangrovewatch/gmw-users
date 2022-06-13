import { Link } from '../styles/typography'
import { Stack, Typography } from '@mui/material'
import React from 'react'

const FakeSite = () => {
  return (
    <Stack>
      <Typography variant='h4'>Fake Site for Demo</Typography>
      <Link to='/site/1/form/project-details'>Project Details</Link>
      <Link to='/site/1/form/site-background'>Site Background</Link>
      <Link to='/site/1/form/restoration-aims'>Restoration Aims</Link>
      <Link to='/site/1/form/causes-of-decline'>Causes of Decline</Link>
    </Stack>
  )
}

export default FakeSite
