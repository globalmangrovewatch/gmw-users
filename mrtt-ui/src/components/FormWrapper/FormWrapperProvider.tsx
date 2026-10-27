import { useEffect, useRef, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'

import { defaultValues, registrationSchema, type RegistrationFormValues } from '@/forms/schemas'

function FormWrapperProvider({ children }: { children: ReactNode }) {
  // fetch api data, merge defaultValues
  // fix date
  // initialize form with data
  // remove save from steps use just navigation buttons
  // validate by step
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues
  })

  // The form instance is a singleton shared across all routes. Reset it to
  // defaults whenever the active site changes so one site's answers don't carry
  // over to the next. Provider sits outside <Routes>, so useParams() is empty
  // here — derive the site id from the pathname instead.
  const { pathname } = useLocation()
  const siteId = pathname.match(/\/sites\/([^/]+)/)?.[1]
  const prevSiteId = useRef(siteId)

  useEffect(() => {
    if (prevSiteId.current !== siteId) {
      form.reset(defaultValues)
      prevSiteId.current = siteId
    }
  }, [siteId]) // eslint-disable-line react-hooks/exhaustive-deps

  return <FormProvider {...form}>{children}</FormProvider>
}

export default FormWrapperProvider
