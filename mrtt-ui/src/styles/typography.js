import { styled, Typography } from '@mui/material'

export const ErrorText = styled(Typography)`
  color: red;
`
ErrorText.defaultProps = { variant: 'subtitle' }

export const Link = (props) => <LinkMui component={LinkReactRouter} {...props} />
