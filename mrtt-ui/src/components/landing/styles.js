import styled from '@emotion/styled'
import theme from '../../styles/theme'
import { css } from '@emotion/react'

export const LanguagePickerStyledContainer = styled('div')`
  position: absolute;
  display: flex;
  bottom: 20px;
  justify-content: center;
  align-items: end;
  z-index: 20;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
`

export const StyledLabel = styled('label')`
  color: ${theme.color.white};
  font-size: ${theme.typography.largeFontSize};
  font-weight: 600;
  &:hover {
    color: ${theme.color.primaryHover};
  }
`

export const MenuStyledLabel = styled('span')`
  text-transform: capitalize;
  display: flex;
  align-items: start;
  z-index: 20;
  justify-content: start;
  color: ${(props) => (props.active === 'true' ? theme.color.primary : theme.color.text)};
  padding: 6px 8px;
  color: ${theme.color.white};
  font-size: ${theme.typography.smallFontSize};
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
