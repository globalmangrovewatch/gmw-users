import Stack from '@mui/material/Stack'
import { useState, useCallback } from 'react'

import AboutDialogContent from '../about'
import ContactForm from '../contact'
import { ContactUsButton } from '../contact/styles'
import LanguagePicker from '../language-selector'
import { Link } from 'react-router-dom'
import { MenuStyledLabel } from './styles'

const LandingHeaderDesktop = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenAbout, setIsOpenAbout] = useState(false)

  const handleContactFormDialog = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleAbout = useCallback(() => {
    setIsOpenAbout((prev) => !prev)
  }, [])

  return (
    <>
      <Stack
        direction='row'
        spacing={4}
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          alignItems: 'center',
          backgroundColor: 'transparent',
          zIndex: 10,
          color: 'red'
        }}>
        <ContactUsButton type='button' onClick={handleAbout}>
          <MenuStyledLabel>About</MenuStyledLabel>
        </ContactUsButton>
        <ContactUsButton type='button' onClick={handleContactFormDialog}>
          <MenuStyledLabel>Contact us</MenuStyledLabel>
        </ContactUsButton>

        <Link
          to='https://tnc\.app\.box\.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06'
          rel='noreferrer'
          target='_blank'
          style={{ textDecoration: 'none' }}>
          <MenuStyledLabel> User guide</MenuStyledLabel>
        </Link>
        <LanguagePicker />
      </Stack>

      <AboutDialogContent isOpen={isOpenAbout} setIsOpen={setIsOpenAbout} />
      <ContactForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default LandingHeaderDesktop
