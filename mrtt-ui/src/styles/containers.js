import { styled } from '@mui/system'
import { Link } from 'react-router-dom'
import theme from './theme'

const PagePadding = styled('div')(({ theme }) => ({
  padding: theme.spacing(2)
}))

const RowSpaceBetween = styled('div')`
  display: flex;
  justify-content: space-between;
`

const LinkCard = styled(Link)(({ theme: themeMui }) => ({
  padding: `${themeMui.spacing(3)} ${themeMui.spacing(1)}`,
  border: theme.border.primary,
  margin: `${themeMui.spacing(3)} 0`,
  textDecoration: 'none',
  color: theme.color.text
}))

export { PagePadding, RowSpaceBetween, LinkCard }
