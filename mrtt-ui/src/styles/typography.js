import { styled, Typography, Link as LinkMui } from '@mui/material'
import NextLink from 'next/link'
import { forwardRef } from 'react'
import { ButtonPrimary, ButtonSecondary } from './buttons'

import theme from './theme'
import themeMui from './themeMui'

export const ErrorText = styled(
  forwardRef(function ErrorText(props, ref) {
    return <Typography variant='subtitle' ref={ref} {...props} />
  })
)`
  color: red;
`

export const H2 = styled('h2')`
  margin: ${themeMui.spacing(1)} 0;
`

export const H4 = styled('h4')`
  margin: ${themeMui.spacing(1)} 0;
`

export const Link = (props) => (
  <LinkMui sx={{ display: 'inline-flex' }} component={NextLink} {...props} />
)

export const LinkLooksLikeButtonPrimary = (props) => (
  <ButtonPrimary component={NextLink} {...props} />
)

export const LinkLooksLikeButtonSecondary = (props) => (
  <ButtonSecondary component={NextLink} {...props} />
)

export const SmallUpperCase = styled('div')`
  text-transform: uppercase;
  font-size: ${theme.typography.smallFontSize};
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
