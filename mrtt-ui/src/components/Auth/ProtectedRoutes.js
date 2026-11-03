'use client'

import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import LoadingIndicator from '@/components/LoadingIndicator'

function ProtectedRoutes({ children }) {
  const { isLoggedIn, isChecking } = useAuth()
  const router = useRouter()
  const isSignedOut = !isChecking && !isLoggedIn

  useEffect(() => {
    if (isSignedOut) router.replace('/auth/login')
  }, [isSignedOut, router])

  if (!isLoggedIn) return <LoadingIndicator />

  return <div>{children}</div>
}

ProtectedRoutes.propTypes = { children: PropTypes.node.isRequired }

export default ProtectedRoutes
