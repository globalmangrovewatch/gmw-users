import React from 'react'
import styled from '@emotion/styled'
import theme from '../../styles/theme'
import HeaderMenu from './HeaderMenu'

const HeaderContainer = styled('header')`
  background-color: ${theme.color.secondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  color: white;
  height: ${theme.layout.headerHeight};
  width: 100vw;
  z-index: 3;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    left: 0;
  }
`
const LogoWrapper = styled('div')`
  background-color: ${theme.color.primary};
  border-bottom-right-radius: 100% 100%;
  padding: 10px;
  min-width: 70px;
  min-height: 30px;
`

const Header = () => {
  return (
    <HeaderContainer>
      <LogoWrapper>logo</LogoWrapper>
      <HeaderMenu />
    </HeaderContainer>
  )
}

export default Header
