'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PropTypes from 'prop-types'

import { Alert, Button } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/system'

import { RowFlexEnd } from '@/styles/containers'
import { ErrorText, Link as ExternalLink } from '@/styles/typography'
import { useAuth } from '@/hooks/useAuth'
import { useSignInMutation } from '@/hooks/sign-in'
import { syncSession } from '@/hooks/sso'
import language from '@/language'
import LoadingIndicator from '@/components/LoadingIndicator'
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
} from '@/styles/v2/containers/landing'
import { Paragraph, StyledLink } from '@/styles/v2/ui/typography'
import { Divider } from '@/styles/v2/ui/divider'
import { FormInput } from '@/components/Form/FormInput'

import LandingHeaderDesktop from '@/components/landing/header-desktop'
import LandingHeaderMobile from '@/components/landing/header-mobile'

const validationSchema = z.object({
  email: z.string({ error: 'Email required' }).min(1, 'Email required'),
  password: z.string({ error: 'Password required' }).min(1, 'Password required')
})

const formDefaultValues = { email: '', password: '' }

const pageLanguage = language.pages.login

const LoginForm = ({ isUserNew }) => {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const signInMutation = useSignInMutation()

  const {
    control: formControl,
    handleSubmit: validateInputs,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: formDefaultValues
  })

  const { isChecking, isLoggedIn, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isChecking && isLoggedIn) {
      router.replace('/sites')
    }
  }, [isChecking, isLoggedIn, router])

  const handleSubmit = (formData) => {
    setIsSubmitError(false)

    signInMutation.mutate(formData, {
      onSuccess: async (data) => {
        if (!data?.token) return
        const user = {
          email: formData.email,
          name: data.username,
          organization: data.organization
        }
        await syncSession(data.token)
        login(data.token, user)
        router.push('/sites')
      },
      onError: (error) => {
        setIsSubmitError(true)
        toast.error(error?.body?.error ?? 'Login failed')
      }
    })
  }

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (isChecking) return <LoadingIndicator />

  return (
    <Base>
      <LandingHeaderContainer>
        <LogoContainer draggable='false'>
          <a href='https://www.globalmangrovewatch.org/' target='_blank' rel='noreferrer'>
            <Logo src='/images/landing/logo.webp' />
          </a>
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
              href='https://tnc.app.box.com/s/pspea7mm2m2uldrqvhahmvp9dck6mc06'
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
            <StyledLink href='/auth/password/forgot-password'>
              {pageLanguage.forgotPassowrd}
            </StyledLink>
            <Divider />
            <Paragraph>
              Don&apos;t have an account?&nbsp;
              <StyledLink href='/auth/signup'>{pageLanguage.signUp}</StyledLink>
            </Paragraph>
          </FormFooter>
        </MainContent>
      </Main>
    </Base>
  )
}

LoginForm.propTypes = {
  isUserNew: PropTypes.bool
}

LoginForm.defaultValues = {
  isUserNew: false
}

export default LoginForm
