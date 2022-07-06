import React from 'react'
import { styled, css } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import {
  Map as SitesIcon,
  Language as LandscapesIcon,
  PeopleOutline as OrganizationsIcon
} from '@mui/icons-material'
import theme from '../../styles/theme'
import themeMui from '../../styles/themeMui'

const StyledFooter = styled('footer')`
  display: flex;
  justify-content: space-around;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  border-color: ${theme.color.primary};
  border-style: solid;
  border-width: 1px 0 0 0;
  text-transform: uppercase;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  z-index: 2;
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    flex-direction: column;
    left: 0;
    top: ${theme.layout.headerHeight};
    width: ${theme.layout.navWidth};
    justify-content: flex-start;
    border-width: 0 1px 0 0;
  }
  a,
  a:visited {
    text-decoration: none;
  }
`

const LinkContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => (props.active === 'true' ? theme.color.primary : theme.color.text)};
  @media (min-width: ${theme.layout.mediaQueryDesktop}) {
    flex-direction: row;
    gap: 1rem;
    padding: ${themeMui.spacing(1)} ${themeMui.spacing(2)};
  }
  ${theme.hoverState(css`
    color: ${theme.color.primaryHover};
  `)}
`

function MobileFooter() {
  const { pathname } = useLocation()

  return (
    <StyledFooter>
      <LinkContainer to='/sites' active={String(/^\/sites/.test(pathname))}>
        <SitesIcon />
        <span>Sites</span>
      </LinkContainer>
      <LinkContainer to='/landscapes' active={String(/^\/landscapes/.test(pathname))}>
        <LandscapesIcon />
        <span>Landscapes</span>
      </LinkContainer>
      <LinkContainer to='/organizations' active={String(/^\/organizations/.test(pathname))}>
        <OrganizationsIcon />
        <span>Organizations</span>
      </LinkContainer>
    </StyledFooter>
  )
}

export default MobileFooter
