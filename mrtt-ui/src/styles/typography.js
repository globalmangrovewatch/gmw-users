import { styled, Typography, Link as LinkMui } from '@mui/material'
import { Link as LinkReactRouter } from 'react-router-dom'
import theme from './theme'

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

export const SmallUpperCase = styled('div')`
  text-transform: uppercase;
  font-size: ${theme.typography.smallFontSize};
`

export const XSmallUpperCase = styled('div')`
  text-transform: uppercase;
  font-size: ${theme.typography.xsmallFontSize};
`

export const CardTitle = styled('h3')`
  margin: 0;
  font-weight: 200;
  font-size: ${theme.typography.xlargeFontSize};
`
export const PageTitle = styled('h2')`
  font-size: ${theme.typography.xlargeFontSize};
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 2px;
`
export const CardSubTitle = styled('p')`
  color: ${theme.color.slub};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
`
