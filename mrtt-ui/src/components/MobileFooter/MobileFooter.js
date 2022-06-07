import React from 'react'
import { styled } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import {
  Map as SitesIcon,
  Language as LandscapesIcon,
  PeopleOutline as OrganizationsIcon
} from '@mui/icons-material'
import theme from '../../styles/theme'

const StyledFooter = styled('footer')`
  display: flex;
  justify-content: space-around;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  border-top: 1px solid ${theme.color.primary};
  font-family: 'Open Sans', sans-serif;
  text-transform: uppercase;
  font-weight: 300;

  a,
  a:visited {
    text-decoration: none;
  }
`

const LinkContainer = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;

  color: ${(props) => (props.active === 'true' ? theme.color.primaryHover : theme.color.slub)};
  div {
    color: theme.color.slub;
  }

  border-bottom-width: 2px;
  border-bottom-style: solid;

  border-bottom-color: ${(props) =>
    props.active === 'true' ? theme.color.primaryHover : 'transparent'};
`

function MobileFooter() {
  const { pathname } = useLocation()

  return (
    <StyledFooter>
      <LinkContainer to='/sites' active={String(/^\/sites/.test(pathname))}>
        <SitesIcon />
        <div>Sites</div>
      </LinkContainer>
      <LinkContainer to='/landscapes' active={String(/^\/landscapes/.test(pathname))}>
        <LandscapesIcon />
        <div>landscapes</div>
      </LinkContainer>
      <LinkContainer to='/organizations' active={String(/^\/organizations/.test(pathname))}>
        <OrganizationsIcon />
        <div>organizations</div>
      </LinkContainer>
    </StyledFooter>
  )
}

export default MobileFooter
