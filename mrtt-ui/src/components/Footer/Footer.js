import React from 'react'
import { styled } from '@mui/system'
import { Link, useLocation } from 'react-router-dom'
import {
  Map as SitesIcon,
  Language as LandscapesIcon,
  PeopleOutline as OrganizationsIcon
} from '@mui/icons-material'

const StyledFooter = styled('footer')`
  /* Hide display in mobile mode in favour of a sidebar */
  @media (max-width: 767px) {
    visibility: visible;
    display: flex;
  }

  visibility: hidden;
  display: none;
  justify-content: space-around;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  border-top: 1px solid #009b93;
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

  color: ${(props) => (props.active ? '#00c6bd' : '#121212')};
  div {
    color: #121212;
  }

  border-bottom-width: 2px;
  border-bottom-style: solid;

  border-bottom-color: ${(props) => (props.active ? '#00c6bd' : 'transparent')};
`

function Footer() {
  const { pathname } = useLocation()

  return (
    <StyledFooter>
      <LinkContainer to='/sites' active={/^\/sites/.test(pathname)}>
        <SitesIcon />
        <div>Sites</div>
      </LinkContainer>
      <LinkContainer to='/landscapes' active={/^\/landscapes/.test(pathname)}>
        <LandscapesIcon />
        <div>landscapes</div>
      </LinkContainer>
      <LinkContainer to='/organizations' active={/^\/organizations/.test(pathname)}>
        <OrganizationsIcon />
        <div>organizations</div>
      </LinkContainer>
    </StyledFooter>
  )
}

export default Footer