import styled from '@emotion/styled'
import theme from '../../styles/theme'
import { css } from '@emotion/react'

export const StyledLabel = styled('span')`
  text-transform: capitalize;
  display: flex;
  align-items: start;
  z-index: 20;
  font-weight: 400;
  font-size: ${theme.typography.smallFontSize};
  justify-content: start;
  color: ${(props) => (props.active === 'true' ? theme.color.primary : theme.color.text)};
  @media (min-width: 1025px) {
    color: #0f2b3b;
  }

  ${theme.hoverState(css`
    color: ${theme.color.primaryHover};
  `)}

  &:hover {
    background-color: rgba(0, 133, 127, 0.04);
  }
`
