'use client'

import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import LoadingIndicator from '@/components/LoadingIndicator'
import { useAuth } from '@/hooks/useAuth'

/** Shows its children to signed-in users and sends everyone else to the login page. */
function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { isLoggedIn, isChecking } = useAuth()
  const router = useRouter()
  const isSignedOut = !isChecking && !isLoggedIn

  useEffect(() => {
    if (isSignedOut) router.replace('/auth/login')
  }, [isSignedOut, router])

  if (!isLoggedIn) return <LoadingIndicator />

  return <div>{children}</div>
}

export default ProtectedRoutes
