import { useState } from 'react'
import { Button, Menu, Stack } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import { StyledLabel } from './styles'

import { ButtonSecondary } from 'styles/buttons'
import { PaddedSection } from 'styles/containers'
import theme from 'styles/theme'
import language from 'language'

import { useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'
import { ssoLogout } from 'hooks/sso'
import ContactForm from 'components/contact'
import { ContactUsButton } from 'components/contact/styles'
import LanguagePicker from 'components/language-selector'

const CustomButton = styled(Button)`
  margin: 0;
  color: ${theme.color.white};
`

function HeaderMenu() {
  const [anchorElement, setAnchorElement] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  async function handleLogoutOnClick() {
    setAnchorElement(null)
    await ssoLogout()
    logout()
    navigate('/auth/login')
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
              <StyledLabel> Contact us</StyledLabel>
            </ContactUsButton>
            <a
              href='https://tnc.app.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06'
              rel='noreferrer'
              target='_blank'
              style={{ textDecoration: 'none' }}>
              <StyledLabel> User guide</StyledLabel>
            </a>
            <Stack spacing={1}>
              <StyledLabel> Language</StyledLabel>
              <LanguagePicker theme='light' />
            </Stack>
            <div>
              <ContactForm isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </Stack>
          <Stack spacing={1}>
            <StyledLabel>Profile Placeholder</StyledLabel>
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
