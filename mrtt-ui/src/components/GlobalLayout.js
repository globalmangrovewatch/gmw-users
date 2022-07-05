import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'
import theme from '../styles/theme'

import Footer from './MobileFooter'
import Header from './Header/Header'
import themeMui from '../styles/themeMui'

import { useAuth } from '../hooks/useAuth'

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  background-color: ${theme.color.bodyBackground};
  height: 100vh;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    margin-left: ${theme.layout.navWidth};
  }
`
const Main = styled('main')`
  margin: ${theme.layout.headerHeight} 0 ${themeMui.spacing(4)} 0;
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
