import { styled } from '@mui/system'
import theme from './theme'

export const TableAlertnatingRows = styled('table')(({ theme: themeMui }) => ({
  textAlign: 'left',
  width: '100%',
  '& th': {
    fontWeight: 'normal'
  },
  '& tr:nth-of-type(even)': {
    background: theme.color.rowEven
  },
  '& tr:nth-of-type(odd)': {
    background: theme.color.rowOdd
  },
  '& th, td': {
    padding: themeMui.spacing(1)
  }
}))
