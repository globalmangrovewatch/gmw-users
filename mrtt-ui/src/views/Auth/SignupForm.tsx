'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import ButtonSubmit from '@/components/ButtonSubmit'
import { FormInput } from '@/components/form/FormInput'
import { FormLayout } from '@/components/form/layout'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { ButtonContainer, PagePadding, RowFlexEnd } from '@/components/ui/layout'
import { toast } from '@/components/ui/toast'
import { ErrorText, PageTitle } from '@/components/ui/typography'
import language from '@/language'
import { authApi } from '@/lib/api'

const signUpFormLanguage = language.pages.userSignUp

const required = z.string({ error: language.form.required }).min(1, language.form.required)

const validationSchema = z
  .object({
    name: z.string().optional(),
    email: z.email({
      error: (issue) =>
        issue.input ? signUpFormLanguage.validation.emailValid : language.form.required
    }),
    password: required.min(8, signUpFormLanguage.validation.passwordMinimumCharacters),
    confirmationPassword: required,
    termsAndConditions: z
      .boolean()
      .refine((accepted) => accepted, signUpFormLanguage.validation.termsAndConditions)
  })
  .refine(({ password, confirmationPassword }) => password === confirmationPassword, {
    error: signUpFormLanguage.validation.passwordsMustMatch,
    path: ['confirmationPassword'],
    when: () => true
  })

type SignupFormInput = z.input<typeof validationSchema>
type SignupFormValues = z.output<typeof validationSchema>

/** Creates an account, then sends the user to log in. */
function SignupForm() {
  const [isSubmitError, setIsSubmitError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<SignupFormInput, unknown, SignupFormValues>({
    resolver: zodResolver(validationSchema, undefined, { raw: true }),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmationPassword: '',
      termsAndConditions: false
    }
  })

  const handleSubmit = ({ email, name, password }: SignupFormValues) => {
    setIsSubmitting(true)
    setIsSubmitError(false)
    authApi
      .post('/users', { user: { email, name, password } })
      .then(() => {
        setIsSubmitting(false)
        toast.success(language.success.signup)
        router.push('/auth/login/newUser')
      })
      .catch(() => {
        setIsSubmitting(false)
        setIsSubmitError(true)
        toast.error(language.error.generic)
      })
  }

  return (
    <PagePadding className='flex flex-col'>
      <PageTitle>{signUpFormLanguage.title}</PageTitle>
      <Form {...form}>
        <FormLayout onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <FormInput<SignupFormInput, 'name'>
            name='name'
            label={signUpFormLanguage.name}
            autoComplete='name'
          />
          <FormInput<SignupFormInput, 'email'>
            name='email'
            type='email'
            label={signUpFormLanguage.email}
            autoComplete='email'
            required
          />
          <FormInput<SignupFormInput, 'password'>
            name='password'
            type='password'
            label={signUpFormLanguage.password}
            autoComplete='new-password'
            required
          />
          <FormInput<SignupFormInput, 'confirmationPassword'>
            name='confirmationPassword'
            type='password'
            label={signUpFormLanguage.confirmPassword}
            autoComplete='new-password'
            required
          />
          <FormField
            control={form.control}
            name='termsAndConditions'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-start gap-3'>
                  <FormControl>
                    <Checkbox
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <FormLabel required className='leading-snug font-normal'>
                    I have read and accept the terms of the{' '}
                    <a
                      href='/mrtt-general-usage-terms-and-conditions.pdf'
                      target='_blank'
                      rel='noopener'
                      className='text-brand-800 underline hover:text-brand-hover'>
                      MRTT- general (usage) terms and conditions
                    </a>{' '}
                    applicable to the use of this account and the Mangrove Restoration Tracker Tool
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <RowFlexEnd>
            {isSubmitError ? <ErrorText>{language.error.submit}</ErrorText> : null}
          </RowFlexEnd>
          <ButtonContainer>
            <Button type='button' variant='outline' onClick={() => router.back()}>
              {language.buttons.cancel}
            </Button>
            <ButtonSubmit isSubmitting={isSubmitting} />
          </ButtonContainer>
        </FormLayout>
      </Form>
    </PagePadding>
  )
}

export default SignupForm
