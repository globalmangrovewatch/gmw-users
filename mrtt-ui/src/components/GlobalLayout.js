import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'
import theme from '../styles/theme'

import Footer from './MobileFooter'
import Header from './Header/Header'

import { useAuth } from '../hooks/useAuth'

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: ${theme.color.bodyBackground};
  height: 100vh;
  & main {
    flex-grow: 2;
  }
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    margin-left: ${theme.layout.navWidth};
  }
`
const Main = styled('main')`
  margin-top: ${theme.layout.headerHeight};
  max-width: ${theme.layout.maxContentWidth};
`

const GlobalLayout = ({ children }) => {
  const { isLoggedIn } = useAuth()
  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
      {isLoggedIn && <Footer />}
    </LayoutWrapper>
  )
}

GlobalLayout.propTypes = { children: PropTypes.node.isRequired }

export default GlobalLayout
