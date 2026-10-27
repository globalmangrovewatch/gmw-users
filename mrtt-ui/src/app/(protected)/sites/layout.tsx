'use client'

import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'

import FormWrapperProvider from '@/components/FormWrapper/FormWrapperProvider'

// Remounting the registration form per site resets it to its defaults, so one site's answers
// never show up in another site's (or a new site's) form.
export default function SitesLayout({ children }: { children: ReactNode }) {
  const { siteId } = useParams<{ siteId?: string }>()
  return <FormWrapperProvider key={siteId ?? 'new'}>{children}</FormWrapperProvider>
}
