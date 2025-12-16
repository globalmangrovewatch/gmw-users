import PropTypes from 'prop-types'
import { useState, useCallback } from 'react'
import { Dialog, DialogContent, Stack, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import { ButtonBurger, ButtonBurgerItem } from '../../styles/buttons'
import theme from '../../styles/theme'
import AboutDialogContent from '../about'
import ContactForm from '../contact'
import { ContactUsButton } from '../contact/styles'
import LanguagePicker from '../language-selector'
import { LanguagePickerStyledContainer, StyledLabel } from './styles'

const LandingHeaderMobile = () => {
  const [isOpenDialog, setDialogOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenAbout, setIsOpenAbout] = useState(false)

  const handleContactFormDialog = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleAbout = useCallback(() => {
    setIsOpenAbout((prev) => !prev)
  }, [])

  const handleClickOpen = useCallback(() => {
    setDialogOpen((prev) => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  return (
    <>
      <ButtonBurger onClick={handleClickOpen}>
        <ButtonBurgerItem />
        <ButtonBurgerItem />
      </ButtonBurger>
      <Dialog open={isOpenDialog} fullWidth>
        <DialogContent
          sx={{
            position: 'fixed',
            backgroundColor: theme.color.primary,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0
          }}>
          <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
            <CloseIcon onClick={handleClose} />
          </IconButton>

          <Stack
            spacing={2}
            direction='column'
            sx={{ minWidth: '200px', mt: 4, position: 'relative', height: '100%', zIndex: 1000 }}>
            <ContactUsButton type='button' onClick={handleAbout}>
              <StyledLabel>About</StyledLabel>
            </ContactUsButton>

            <ContactUsButton type='button' onClick={handleContactFormDialog}>
              <StyledLabel>Contact us</StyledLabel>
            </ContactUsButton>

            <LanguagePickerStyledContainer>
              <LanguagePicker theme='light' />
            </LanguagePickerStyledContainer>
            <a
              href='https://tnc.app.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06'
              rel='noopener noreferrer'
              target='_blank'
              style={{ textDecoration: 'none' }}>
              <StyledLabel>User Guide</StyledLabel>
            </a>
            <AboutDialogContent isOpen={isOpenAbout} setIsOpen={setIsOpenAbout} />
            <ContactForm isOpen={isOpen} setIsOpen={setIsOpen} />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

PropTypes.LandingHeaderMobile = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAbout: PropTypes.func.isRequired,
  onContact: PropTypes.func.isRequired
}

export default LandingHeaderMobile
