import { styled } from '@mui/system'
import theme from './theme'

const UlAlternating = styled('ul')`
  list-style-type: none;
  padding: 0;
  margin: 0;
  li:nth-of-type(even) {
    background: ${theme.color.rowEven};
  }
  li:nth-of-type(odd) {
    background: ${theme.color.rowOdd};
  }
`

const UlUndecorated = styled('ul')`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

export { UlAlternating, UlUndecorated }
