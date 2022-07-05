import { Button, Menu, Stack } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React from 'react'
import styled from '@emotion/styled'

import { ButtonSecondary } from '../../styles/buttons'
import { PaddedSection } from '../../styles/containers'
import language from '../../language'
import theme from '../../styles/theme'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const CustomButton = styled(Button)`
  margin: 0;
  color: ${theme.color.white};
`

function HeaderMenu() {
  const [anchorElement, setAnchorElement] = React.useState(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogoutOnClick() {
    logout()
    navigate('/auth/login')
    setAnchorElement(null)
  }

  function handleMenuClick(event) {
    setAnchorElement(event.currentTarget)
  }

  function handleMenuClose() {
    setAnchorElement(null)
  }

  return (
    <>
      <CustomButton
        aria-owns={anchorElement ? 'header-menu' : undefined}
        aria-haspopup='true'
        aria-label='Menu'
        onClick={handleMenuClick}>
        <MenuIcon />
      </CustomButton>
      <Menu
        id='header-menu'
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        onClose={handleMenuClose}>
        <PaddedSection>
          <Stack>
            <label>Profile Placeholder</label>
            <div>
              <ButtonSecondary onClick={handleLogoutOnClick}>
                {language.header.logout}
              </ButtonSecondary>
            </div>
          </Stack>
        </PaddedSection>
      </Menu>
    </>
  )
}

export default HeaderMenu
