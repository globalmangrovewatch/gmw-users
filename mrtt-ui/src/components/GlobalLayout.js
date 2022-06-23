import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'
import theme from '../styles/theme'

import Footer from './MobileFooter'

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: ${theme.color.bodyBackground};
  height: 100vh;
  & main {
    flex-grow: 2;
  }
  @media (min-width: ${theme.spacing.mediaQueryMobile}) {
    margin-left: ${theme.spacing.navWidth};
  }
`
const Main = styled('main')`
  margin-top: ${theme.spacing.headerHeight};
  max-width: 69rem;
`
const Header = styled('header')`
  position: fixed;
  top: 0;
  background: ${theme.color.primary};
  color: white;
  padding: 1rem;
  height: ${theme.spacing.headerHeight};
  width: 100vw;
  z-index: 2;
  @media (min-width: ${theme.spacing.mediaQueryMobile}) {
    left: 0;
  }
`

const GlobalLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header>Header placeholder</Header>
      <Main>{children}</Main>
      <Footer />
    </LayoutWrapper>
  )
}

GlobalLayout.propTypes = { children: PropTypes.node.isRequired }

export default GlobalLayout
