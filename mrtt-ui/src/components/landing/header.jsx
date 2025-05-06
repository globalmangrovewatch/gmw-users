import Stack from '@mui/material/Stack'
import { useState, useCallback } from 'react'

import AboutDialogContent from '../about'
import ContactForm from '../contact'
import { ContactUsButton } from '../contact/styles'
import LanguagePicker from '../language-selector'

const LandingHeader = () => {
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
        spacing={2}
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          alignItems: 'center',
          backgroundColor: 'transparent',
          zIndex: 10
        }}>
        <ContactUsButton type='button' onClick={handleAbout}>
          About
        </ContactUsButton>

        <ContactUsButton type='button' onClick={handleContactFormDialog}>
          Contact us
        </ContactUsButton>
        <LanguagePicker />
      </Stack>

      <AboutDialogContent isOpen={isOpenAbout} setIsOpen={setIsOpenAbout} />
      <ContactForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default LandingHeader
