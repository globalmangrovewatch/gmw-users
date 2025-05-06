import { Button } from '@mui/material'
import { styled } from '@mui/system'
import { Button as ButtonBase } from '@mui/base'

import PropTypes from 'prop-types'
import ButtonSecondaryWithLoader from '../components/ButtonSecondaryWithLoader'
import language from '../language'
import theme from './theme'

const ButtonPrimary = styled(Button)``
ButtonPrimary.defaultProps = { variant: 'contained' }

const ButtonSecondary = styled(Button)``
ButtonSecondary.defaultProps = { variant: 'outlined' }

const ButtonSubmit = ({ isSubmitting }) => {
  return (
    <Button variant='contained' type='submit' disabled={isSubmitting}>
      {isSubmitting ? language.buttons.submitting : language.buttons.submit}
    </Button>
  )
}

const ButtonCaution = styled(ButtonSecondaryWithLoader)`
  background-color: ${theme.color.red};
  &:hover {
    background-color: ${theme.color.lightRed};
  }
`
ButtonSubmit.propTypes = {
  isSubmitting: PropTypes.bool.isRequired
}

const ButtonCancel = (props) => (
  <ButtonSecondary {...props}>{language.buttons.cancel}</ButtonSecondary>
)

const ButtonBurger = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  width: 54,
  height: 54,
  'z-index': 1000,
  border: 'none',
  position: 'absolute',
  top: 16,
  right: 16,
  borderRadius: '100%',
  backgroundColor: theme.palette.primary.main,
  boxShadow: '0px 4px 12px 0px #003C3926',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '0 12px'
}))

const ButtonBurgerItem = styled('div')`
  display: flex;
  width: 100%;
  height: 2px;
  background-color: ${theme.color.white};
  margin: 4px 0;
  transition: 0.4s;
  border-radius: 2px;
  height: 2px;
`

export {
  ButtonPrimary,
  ButtonSubmit,
  ButtonSecondary,
  ButtonCancel,
  ButtonCaution,
  ButtonBurger,
  ButtonBurgerItem
}
