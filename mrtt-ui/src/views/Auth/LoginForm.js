import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import PropTypes from 'prop-types'

import { Alert } from '@mui/material'
import { RowFlexEnd } from '../../styles/containers'
import { ErrorText, Link as ExternalLink } from '../../styles/typography'
import { useAuth } from '../../hooks/useAuth'
import language from '../../language'
import LoadingIndicator from '../../components/LoadingIndicator'
import {
  Hero,
  HeroContent,
  HeroHeadline,
  HeroText,
  Base,
  Main,
  MainContent,
  MainTitle,
  Form,
  FormFooter,
  LogoContainer,
  Logo,
  LandingHeaderContainer
} from '../../styles/v2/containers/landing'
import { Paragraph, StyledLink } from '../../styles/v2/ui/typography'
import { Divider } from '../../styles/v2/ui/divider'
import { FormInput } from '../../components/Form/FormInput'

import LandingHeaderDesktop from '../../components/landing/header-desktop'
import LandingHeaderMobile from '../../components/landing/header-mobile'
import { useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/system'
import { Button } from '@mui/material'

const validationSchema = yup.object({
  email: yup.string().required('Email required'),
  password: yup.string().required('Password required')
})

const formDefaultValues = { email: '', password: '' }

const pageLanguage = language.pages.login

const LoginForm = ({ isUserNew }) => {
  const [isLoading] = useState(false)
  const [isSubmitError, setIsSubmitError] = useState(false)
  const navigate = useNavigate()

  const authUrl = `${process.env.REACT_APP_AUTH_URL}/users/sign_in`

  const { login } = useAuth()

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: formDefaultValues })

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  const signIn = (formData) => {
    axios
      .post(authUrl, { user: formData }, options)
      .then(({ data }) => {
        if (data.token) {
          login(data.token)
          navigate('/sites')
        }
      })
      .catch((error) => {
        setIsSubmitError(true)
        toast.error(error.response.data.error)
      })
  }

  const handleSubmit = (formData) => {
    setIsSubmitError(false)
    signIn(formData)
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const form = (
    <Base>
      <LandingHeaderContainer>
        <LogoContainer draggable='false'>
          <Link to='https://www.globalmangrovewatch.org/' target='_blank' rel='noreferrer'>
            <Logo src='/images/landing/logo.webp' />
          </Link>
        </LogoContainer>
        {!isMobile && <LandingHeaderDesktop />}
        {isMobile && <LandingHeaderMobile />}
      </LandingHeaderContainer>
      <Hero>
        <HeroContent>
          <HeroHeadline>Welcome to the Mangrove Restoration Tracker Tool</HeroHeadline>
          <HeroText variant='text-sm'>
            The MRTT is an open-access resource to support restoration practitioners. It provides a
            secure location to hold information across restoration planning, intervention and
            monitoring.{' '}
            <ExternalLink
              to='https://www.mangrovealliance.org/wp-content/uploads/2023/07/MRTT-Guide-v15.pdf'
              rel='noreferrer'
              target='_blank'
              style={{ color: 'white' }}>
              Learn more
            </ExternalLink>
          </HeroText>
        </HeroContent>
      </Hero>
      <Main>
        <MainContent>
          <MainTitle>{pageLanguage.title}</MainTitle>
          {isUserNew ? (
            <Alert variant='outlined' severity='success'>
              {language.success.signup}
            </Alert>
          ) : null}
          <Form onSubmit={validateInputs(handleSubmit)}>
            <FormInput
              type='email'
              name='email'
              label={pageLanguage.email}
              placeholder='Enter your email'
              control={formControl}
              error={errors?.email?.message}
            />
            <FormInput
              type='password'
              name='password'
              label={pageLanguage.password}
              placeholder='Enter your password'
              control={formControl}
              error={errors?.password?.message}
            />

            <RowFlexEnd>
              {isSubmitError && <ErrorText>{language.error.submit}</ErrorText>}
            </RowFlexEnd>
            <Button type='submit'>Log in</Button>
          </Form>
          <FormFooter>
            <StyledLink to='/auth/password/forgot-password'>
              {pageLanguage.forgotPassowrd}
            </StyledLink>
            <Divider />
            <Paragraph>
              Don&apos;t have an account?&nbsp;
              <StyledLink to='/auth/signup'>{pageLanguage.signUp}</StyledLink>
            </Paragraph>
          </FormFooter>
        </MainContent>
      </Main>
    </Base>
  )

  return isLoading ? <LoadingIndicator /> : form
}

LoginForm.propTypes = {
  isUserNew: PropTypes.bool
}

LoginForm.defaultValues = {
  isUserNew: false
}

export default LoginForm
