'use client'

import { type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { defaultValues, registrationSchema, type RegistrationFormValues } from '@/forms/schemas'

// One form instance per site. The sites layout mounts this with `key={siteId}`, so moving to
// another site (or from /sites/new to the created site) starts from `defaultValues` instead of
// carrying the previous site's answers over.
function FormWrapperProvider({ children }: { children: ReactNode }) {
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues
  })

  return <FormProvider {...form}>{children}</FormProvider>
}

export default FormWrapperProvider
