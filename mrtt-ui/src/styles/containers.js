import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
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
  height: 100%;
  align-items: center;
  justify-content: center;
`
const LinkCard = styled(Link)`
  background: white;
  border-color: ${theme.color.lightGrey};
  border-width: 2px;
  border-style: solid;
  color: ${theme.color.slub};
  margin: ${themeMui.spacing(2)} 0;
  text-decoration: none;
  padding: ${themeMui.spacing(3)};
  &:hover {
    color: ${theme.color.text};
    border-color: ${theme.color.primary};
    border-width: 2px;
  }
`
const ContentWrapper = styled('div')`
  padding: ${themeMui.spacing(2)};
`
const TitleAndActionContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const PaddedPageTopSection = styled(Stack)`
  padding: ${themeMui.spacing(2)};
  border-bottom: ${theme.border.primary};
  background-color: ${theme.color.bodyBackground};
`
const PaddedPageSection = styled(Stack)`
  padding: ${themeMui.spacing(2)};
`
const PaddedSection = styled(Stack)`
  padding: ${themeMui.spacing(2)};
`
export {
  ButtonContainer,
  LinkCard,
  ContentWrapper,
  TitleAndActionContainer,
  PaddedPageSection,
  PaddedPageTopSection,
  PaddedSection,
  PagePadding,
  RowCenterCenter,
  RowFlexEnd,
  RowSpaceBetween
}
