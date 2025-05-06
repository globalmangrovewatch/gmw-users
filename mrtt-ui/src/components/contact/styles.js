import styled from '@emotion/styled'
import theme from '../../styles/theme'
import { Button } from '@mui/material'

export const ContactUsButton = styled(Button)`
  padding: 0;
  text-transform: capitalize;
  justify-content: start;
  color: ${(props) => (props.active === 'true' ? theme.color.primary : theme.color.text)};
`
