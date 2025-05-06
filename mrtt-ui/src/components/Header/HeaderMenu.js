import { useState } from 'react'
import { Button, Menu, Stack } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useCallback } from 'react'
import styled from '@emotion/styled'

import { ButtonSecondary } from '../../styles/buttons'
import { PaddedSection } from '../../styles/containers'
import theme from '../../styles/theme'
import language from '../../language'

import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import ContactForm from '../contact'
import { ContactUsButton } from '../contact/styles'
import LanguagePicker from '../language-selector'

const CustomButton = styled(Button)`
  margin: 0;
  color: ${theme.color.white};
`

function HeaderMenu() {
  const [anchorElement, setAnchorElement] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
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

  const handleContactFormDialog = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

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
          <Stack spacing={3}>
            <ContactUsButton type='button' onClick={handleContactFormDialog}>
              Contact us
            </ContactUsButton>

            <LanguagePicker theme='light' />

            <div>
              <ContactForm isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </Stack>
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
