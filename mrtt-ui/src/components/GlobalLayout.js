'use client'

import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'
import theme from '@/styles/theme'

import Footer from './MobileFooter'
import Header from './Header/Header'
import themeMui from '@/styles/themeMui'
import { useAuth } from '@/hooks/useAuth'

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    margin-left: ${theme.layout.navWidth};
  }
`
const Main = styled('main')`
  margin: ${theme.layout.headerHeight} 0 ${themeMui.spacing(4)} 0;
`
// `isLanding` is set by the layout of the login pages, which use the new landing design.
const GlobalLayout = ({ children, isLanding = false }) => {
  const { isLoggedIn } = useAuth()

  if (isLanding) {
    return (
      <main>
        <Header isLanding />
        {children}
      </main>
    )
  }

  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
      {isLoggedIn && <Footer />}
    </LayoutWrapper>
  )
}

GlobalLayout.propTypes = { children: PropTypes.node.isRequired, isLanding: PropTypes.bool }

export default GlobalLayout
