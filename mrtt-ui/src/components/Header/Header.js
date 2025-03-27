import React from 'react'
import styled from '@emotion/styled'
import theme from '../../styles/theme'
import HeaderMenu from './HeaderMenu'
import { ReactComponent as GmwLogo } from '../../assets/gmw-logo.svg'
import { useFeatureFlags } from '../../hooks/useFeatureFlags'
import { Header as HeaderV2, Logo } from '../../styles/v2/containers/header'

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

const Header = () => {
  const { showNewLandingPage } = useFeatureFlags()

  if (showNewLandingPage) {
    return (
      <HeaderV2>
        <Logo src='/images/landing/logo.webp' />
      </HeaderV2>
    )
  }

  return (
    <HeaderContainer>
      <StyledGmwLogo />
      <HeaderMenu />
    </HeaderContainer>
  )
}

export default Header
