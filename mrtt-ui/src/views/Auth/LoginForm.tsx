'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { USER_GUIDE_URL } from '@/components/about'
import { FormInput } from '@/components/form/FormInput'
import LandingHeader from '@/components/landing/LandingHeader'
import LoadingIndicator from '@/components/LoadingIndicator'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText } from '@/components/ui/typography'
import { useSignInMutation } from '@/hooks/sign-in'
import { syncSession } from '@/hooks/sso'
import { useAuth } from '@/hooks/useAuth'
import language from '@/language'
import { cn } from '@/lib/cn'

const validationSchema = z.object({
  email: z.string({ error: 'Email required' }).min(1, 'Email required'),
  password: z.string({ error: 'Password required' }).min(1, 'Password required')
})

type LoginFormValues = z.infer<typeof validationSchema>

const pageLanguage = language.pages.login

function FooterLink({ className, ...props }: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className={cn('text-sm font-semibold text-brand-800 no-underline hover:underline', className)}
      {...props}
    />
  )
}

type LoginFormProps = {
  /** Set after sign-up, to tell the user to verify their email. */
  isUserNew?: boolean
}

/** The landing page: an intro to the MRTT next to the email/password login form. */
function LoginForm({ isUserNew = false }: LoginFormProps) {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const signInMutation = useSignInMutation()
  const { isChecking, isLoggedIn, login } = useAuth()
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: { email: '', password: '' }
  })

  useEffect(() => {
    if (!isChecking && isLoggedIn) router.replace('/sites')
  }, [isChecking, isLoggedIn, router])

  const handleSubmit = (formData: LoginFormValues) => {
    setIsSubmitError(false)

    signInMutation.mutate(formData, {
      onSuccess: async (data) => {
        if (!data?.token) return
        await syncSession(data.token)
        login(data.token, {
          email: formData.email,
          name: data.username,
          organization: data.organization
        })
        router.push('/sites')
      },
      onError: (error) => {
        setIsSubmitError(true)
        toast.error(error.body?.error ?? 'Login failed')
      }
    })
  }

  if (isChecking) return <LoadingIndicator />

  return (
    <div className="flex h-screen flex-col overflow-y-auto pb-12.5 lg:flex-row lg:overflow-hidden lg:bg-[image:url('/images/landing/bg-shape-white.svg'),url('/images/landing/bg-shape-green.svg'),url('/images/landing/bg.webp')] lg:bg-cover lg:bg-no-repeat lg:pb-0 lg:[background-position:center,left_center,left_center]">
      <LandingHeader />
      <div className="relative flex justify-center bg-[lightgray] bg-[image:linear-gradient(0deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.2)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.56)_45.44%,rgba(0,0,0,0.56)_62.93%,rgba(0,0,0,0.16)_100%),url('/images/landing/bg-small.webp')] bg-cover bg-center bg-no-repeat pt-[25vh] before:absolute before:inset-0 before:bg-[rgba(0,133,127,0.62)] before:opacity-85 before:mix-blend-color before:content-[''] lg:flex-2 lg:items-center lg:justify-start lg:bg-transparent lg:bg-none lg:pt-0 lg:before:hidden">
        <section className='w-full max-w-102.5 p-6 lg:ml-27.5 lg:p-0'>
          <h2 className='mb-6 text-[40px] leading-[50px] font-light text-white'>
            Welcome to the Mangrove Restoration Tracker Tool
          </h2>
          <p className='text-sm text-white'>
            The MRTT is an open-access resource to support restoration practitioners. It provides a
            secure location to hold information across restoration planning, intervention and
            monitoring.{' '}
            <a
              href={USER_GUIDE_URL}
              rel='noreferrer'
              target='_blank'
              className='text-white underline hover:text-brand-hover'>
              Learn more
            </a>
          </p>
        </section>
      </div>
      <div className='flex flex-1 items-center'>
        <section className='w-full p-6 lg:w-85 lg:p-0'>
          <h1 className='mb-10 text-[40px] leading-[50px] font-light text-brand-800'>
            {pageLanguage.title}
          </h1>
          {isUserNew ? (
            <Alert variant='info' className='mb-6'>
              {language.success.signup}
            </Alert>
          ) : null}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              noValidate
              className='mb-6 flex flex-col gap-6'>
              <FormInput<LoginFormValues, 'email'>
                name='email'
                type='email'
                label={pageLanguage.email}
                placeholder='Enter your email'
                autoComplete='email'
              />
              <FormInput<LoginFormValues, 'password'>
                name='password'
                type='password'
                label={pageLanguage.password}
                placeholder='Enter your password'
                autoComplete='current-password'
              />
              <RowFlexEnd>
                {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
              </RowFlexEnd>
              <Button type='submit' disabled={signInMutation.isPending}>
                {pageLanguage.title}
              </Button>
            </form>
          </Form>
          <div className='flex flex-col items-center justify-center gap-6'>
            <FooterLink href='/auth/password/forgot-password'>
              {pageLanguage.forgotPassowrd}
            </FooterLink>
            <hr className='w-full border border-black/10' />
            <p className='text-sm text-[#0f2b3b]'>
              Don&apos;t have an account?&nbsp;
              <FooterLink href='/auth/signup'>{pageLanguage.signUp}</FooterLink>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginForm
