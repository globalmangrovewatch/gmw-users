import styled from '@emotion/styled'
import theme from '../../styles/theme'
import { css } from '@emotion/react'
import { Button } from '@mui/material'

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
