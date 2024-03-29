import { styled, Typography, Link as LinkMui } from '@mui/material'
import { Link as LinkReactRouter } from 'react-router-dom'
import { ButtonPrimary, ButtonSecondary } from './buttons'

import theme from './theme'
import themeMui from './themeMui'

export const ErrorText = styled(Typography)`
  color: red;
`
ErrorText.defaultProps = { variant: 'subtitle' }

export const H2 = styled('h2')`
  margin: ${themeMui.spacing(1)} 0;
`

export const H4 = styled('h4')`
  margin: ${themeMui.spacing(1)} 0;
`

export const Link = (props) => (
  <LinkMui sx={{ display: 'inline-flex' }} component={LinkReactRouter} {...props} />
)

export const LinkLooksLikeButtonPrimary = (props) => (
  <ButtonPrimary component={LinkReactRouter} {...props} />
)

export const LinkLooksLikeButtonSecondary = (props) => (
  <ButtonSecondary component={LinkReactRouter} {...props} />
)

export const SmallUpperCase = styled('div')`
  text-transform: uppercase;
  font-size: ${theme.typography.smallFontSize};
`

export const XSmallUpperCase = styled('div')`
  text-transform: uppercase;
  font-size: ${theme.typography.xsmallFontSize};
`
export const TextSmall = styled('div')`
  font-size: ${theme.typography.smallFontSize};
`

export const ItemTitle = styled('h3')`
  margin: 0;
  font-weight: 200;
  font-size: ${theme.typography.xlargeFontSize};
`
export const PageTitle = styled('h1')`
  font-size: ${theme.typography.xlargeFontSize};
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 2px;
`

export const PageSubtitle = styled('h2')`
  font-weight: 200;
  margin-bottom: 0;
`

export const ItemSubTitle = styled('p')`
  color: ${theme.color.slub};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
`
