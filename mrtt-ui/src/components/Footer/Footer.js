import React from 'react'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'
import {
  Map as SitesIcon,
  Language as LandscapesIcon,
  PeopleOutline as OrganizationsIcon
} from '@mui/icons-material'

const StyledFooter = styled('footer')`
  display: flex;
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

  color: ${(props) => (props.active ? '#00c6bd' : '#121212')};
  div {
    color: #121212;
  }

  border-bottom-width: 2px;
  border-bottom-style: solid;

  border-bottom-color: ${(props) => (props.active ? '#00c6bd' : 'transparent')};
`

function Footer() {
  return (
    <StyledFooter>
      <LinkContainer to='/sites' active={true}>
        <SitesIcon />
        <div>Sites</div>
      </LinkContainer>
      <LinkContainer to='/landscapes'>
        <LandscapesIcon />
        <div>landscapes</div>
      </LinkContainer>
      <LinkContainer to='/organizations'>
        <OrganizationsIcon />
        <div>organizations</div>
      </LinkContainer>
    </StyledFooter>
  )
}

export default Footer
