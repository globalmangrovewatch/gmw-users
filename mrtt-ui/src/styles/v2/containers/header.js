import { styled } from '@mui/system'

export const Header = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Logo = styled('img')(
  ({ theme }) => `
  width: 55%;
  height: auto;
  flex-shrink: 0;

  ${theme.breakpoints.up('lg')} {
    width: 281px;
  }
`
)
