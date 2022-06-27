import React from 'react'
import styled from '@emotion/styled'
import theme from '../../styles/theme'
import HeaderMenu from './HeaderMenu'
import { ReactComponent as GmwLogo } from '../../assets/gmw-logo.svg'

const HeaderContainer = styled('header')`
  background-color: ${theme.color.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  color: ${theme.color.white};
  height: ${theme.layout.headerHeight};
  width: 100vw;
  z-index: 2;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    left: 0;
  }
`

const StyledGmwLogo = styled(GmwLogo)`
  align-self: flex-start;
`
const Header = () => {
  return (
    <HeaderContainer>
      <StyledGmwLogo />

      <HeaderMenu />
    </HeaderContainer>
  )
}

export default Header
