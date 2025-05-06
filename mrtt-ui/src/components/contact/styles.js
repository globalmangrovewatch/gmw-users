import styled from '@emotion/styled'
import theme from '../../styles/theme'
import { css } from '@emotion/react'
import { Button } from '@mui/material'

export const ContactUsButton = styled(Button)`
  text-transform: capitalize;
  display: flex;
  align-items: start;
  z-index: 20;
  justify-content: start;
  color: ${(props) => (props.active === 'true' ? theme.color.primary : theme.color.text)};
  padding: 0 !important;
  color: ${theme.color.white};
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    flex-direction: row;
    gap: 1rem;
  }

  @media (min-width: 1025px) {
    color: #0f2b3b;
  }

  ${theme.hoverState(css`
    color: ${theme.color.primaryHover};
  `)}
`
