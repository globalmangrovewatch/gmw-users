import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'
import theme from '../styles/theme'

import Footer from './MobileFooter'
import Header from './Header/Header'

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
const Header = styled('header')`
  position: fixed;
  top: 0;
  background: ${theme.color.primary};
  color: white;
  padding: 1rem;
  height: ${theme.layout.headerHeight};
  width: 100vw;
  z-index: 2;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    left: 0;
  }
`

const GlobalLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header />
      <main>{children}</main>
      <Footer />
    </LayoutWrapper>
  )
}

GlobalLayout.propTypes = { children: PropTypes.node.isRequired }

export default GlobalLayout
