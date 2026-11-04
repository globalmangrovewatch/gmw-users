import styled from '@emotion/styled'
import theme from '@/styles/theme'
import { css } from '@emotion/react'

export const AboutParagraph = styled('p')`
  color: ${theme.color.lightGrey};
  letter-spacing: 1px;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
  padding-bottom: 20px;
`

export const ExternalLink = styled('a')`
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
  padding: 15px 20px;
`
export const ListItem = styled('li')`
  padding-bottom: 10px;
`

export const Highlight = styled('span')`
  color: ${theme.color.primary};
  letter-spacing: 1px;
  margin: 0;
  font-size: ${theme.typography.smallFontSize};
`
