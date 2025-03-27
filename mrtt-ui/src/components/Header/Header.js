import React from 'react'
import styled from '@emotion/styled'
import theme from '../../styles/theme'
import HeaderMenu from './HeaderMenu'
import { ReactComponent as GmwLogo } from '../../assets/gmw-logo.svg'
import { useFeatureFlags } from '../../hooks/useFeatureFlags'

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
  z-index: 3;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    left: 0;
  }
`

const StyledGmwLogo = styled(GmwLogo)`
  height: 100%;
  width: auto;
`

const HeaderContainerV2 = styled('header')`
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Header = () => {
  const { showNewLandingPage } = useFeatureFlags()

  if (showNewLandingPage) {
    return <HeaderContainerV2>headerV2</HeaderContainerV2>
  }

  return (
    <HeaderContainer>
      <StyledGmwLogo />
      <HeaderMenu />
    </HeaderContainer>
  )
}

export default Header
