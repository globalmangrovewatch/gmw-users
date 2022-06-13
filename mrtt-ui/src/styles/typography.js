import { styled, Typography, Link as LinkMui } from '@mui/material'
import { Link as LinkReactRouter } from 'react-router-dom'

export const ErrorText = styled(Typography)`
  color: red;
`
ErrorText.defaultProps = { variant: 'subtitle' }

export const H4 = styled(Typography)(({ theme }) => ({
  margin: ` ${theme.spacing(1)} 0`
}))
H4.defaultProps = { variant: 'h4' }

export const H5 = styled(Typography)(({ theme }) => ({
  margin: ` ${theme.spacing(1)} 0`
}))
H5.defaultProps = { variant: 'h5' }

export const Link = (props) => <LinkMui component={LinkReactRouter} {...props} />
