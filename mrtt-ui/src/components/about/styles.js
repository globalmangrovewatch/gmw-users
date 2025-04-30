import styled from '@emotion/styled'
import theme from '../../styles/theme'
import { css } from '@emotion/react'
import { Link } from 'react-router-dom'

export const AboutParagraph = styled('p')`
  color: ${theme.color.lightGrey};
  letter-spacing: 1px;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
  padding-bottom: 2rem;
`

export const ExternalLink = styled(Link)`
  color: ${theme.color.primary};
  letter-spacing: 1px;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
  ${theme.hoverState(css`
    color: ${theme.color.primaryHover};
  `)}
`

export const List = styled('ol')`
  color: ${theme.color.lightGrey};
  letter-spacing: 1px;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
  padding: 1.5rem 2rem;
`
export const ListItem = styled('li')`
  padding-bottom: 1rem;
`

export const Highlight = styled('span')`
  color: ${theme.color.primary};
  letter-spacing: 1px;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
`
