import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { css, styled } from '@mui/system'
import theme from './theme'
import themeMui from './themeMui'

const PagePadding = styled('div')`
  padding: ${themeMui.spacing(2)};
`
const RowSpaceBetween = styled('div')`
  display: flex;
  justify-content: space-between;
`
const RowFlexEnd = styled('div')`
  display: flex;
  justify-content: flex-end;
`
const ButtonContainer = styled(RowFlexEnd)`
  gap: ${themeMui.spacing(2)};
`
const RowCenterCenter = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`

const cardCss = css`
  background: white;
  border-width: 2px;
  border-style: solid;
  color: ${theme.color.slub};
  margin: ${themeMui.spacing(2)} 0;
  padding: ${themeMui.spacing(3)};
  text-decoration: none;
`
const LinkCard = styled(Link)`
  ${cardCss}
  cursor: pointer;
  border-color: ${theme.color.lightGreen};
  ${theme.hoverState(css`
    color: ${theme.color.text};
    border-color: ${theme.color.primary};
    border-width: 2px;
  `)}
  @media(hover: none) {
    border-color: ${theme.color.primary};
  }
`
const Card = styled('div')`
  ${cardCss}
  border-color: ${theme.color.primary};
`
const ContentWrapper = styled('div')`
  padding: ${themeMui.spacing(2)};
  max-width: ${theme.layout.maxContentWidth};
  margin-inline: auto;
  min-height: calc(100vh - ${theme.layout.headerHeight});
`
const TitleAndActionContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const PaddedPageTopSection = styled(Stack)`
  padding: ${themeMui.spacing(2)};
  border-bottom: ${theme.border.primary};
`

const PaddedSection = styled(Stack)`
  padding: ${themeMui.spacing(2)};
`
const QuestionWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  max-width: ${theme.layout.maxContentWidth};
`

const LoadingWrapper = styled('div')`
  display: grid;
  height: 100vh;
  place-items: center;
`

export {
  ButtonContainer,
  Card,
  ContentWrapper,
  LinkCard,
  LoadingWrapper,
  PaddedPageTopSection,
  PaddedSection,
  PagePadding,
  QuestionWrapper,
  RowCenterCenter,
  RowFlexEnd,
  RowSpaceBetween,
  TitleAndActionContainer
}
