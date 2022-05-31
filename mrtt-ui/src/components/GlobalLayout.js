import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React from 'react'

import Footer from './Footer'

const LayoutWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
  & main {
    flex-grow: 2;
  }
`
const Header = styled('header')``

const GlobalLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header>Header placeholder</Header>
      <main>{children}</main>
      <Footer />
    </LayoutWrapper>
  )
}

GlobalLayout.propTypes = { children: PropTypes.node.isRequired }

export default GlobalLayout
