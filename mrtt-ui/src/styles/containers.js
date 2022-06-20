import { Link } from 'react-router-dom'
import { Stack } from '@mui/material'
import { styled } from '@mui/system'
import theme from './theme'

const PagePadding = styled('div')(({ theme }) => ({
  padding: theme.spacing(2)
}))

const RowSpaceBetween = styled('div')`
  display: flex;
  justify-content: space-between;
`

const RowFlexEnd = styled('div')`
  display: flex;
  justify-content: flex-end;
`

const ButtonContainer = styled(RowFlexEnd)(({ theme: themeMui }) => ({
  '&& > *': { marginLeft: themeMui.spacing(2) }
}))

const RowCenterCenter = styled('div')`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const LinkCard = styled(Link)(({ theme: themeMui }) => ({
  padding: `${themeMui.spacing(3)} ${themeMui.spacing(1)}`,
  border: theme.border.primary,
  margin: `${themeMui.spacing(3)} 0`,
  textDecoration: 'none',
  color: theme.color.text
}))

const PaddedPageTopSection = styled(Stack)(({ theme: themeMui }) => ({
  padding: themeMui.spacing(2),
  borderBottom: theme.border.primary,
  backgroundColor: theme.color.bodyBackground
}))

const PaddedPageSection = styled(Stack)(({ theme: themeMui }) => ({
  padding: themeMui.spacing(2)
}))

export {
  ButtonContainer,
  LinkCard,
  PaddedPageSection,
  PaddedPageTopSection,
  PagePadding,
  RowCenterCenter,
  RowFlexEnd,
  RowSpaceBetween
}
