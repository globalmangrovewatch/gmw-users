'use client'

import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import theme from '@/styles/theme'
import HeaderMenu from './HeaderMenu'
import { Header as HeaderV2 } from '@/styles/v2/containers/header'

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

const GmwLogo = styled('img')`
  height: 100%;
  width: auto;
`

const Header = ({ isLanding = false }) => {
  if (isLanding) {
    return <HeaderV2></HeaderV2>
  }

  return (
    <HeaderContainer>
      <GmwLogo src='/images/gmw-logo.svg' alt='Global Mangrove Watch' />
      <HeaderMenu />
    </HeaderContainer>
  )
}

Header.propTypes = { isLanding: PropTypes.bool }

export default Header
