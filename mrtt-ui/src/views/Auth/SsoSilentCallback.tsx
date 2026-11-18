'use client'

import { useEffect } from 'react'

import { postSilentCallbackResult, SSO_CODE_PARAM } from '@/hooks/sso'

/** Loaded in the silent SSO iframe: hands the `code` query param back to the parent window. */
function SsoSilentCallback() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get(SSO_CODE_PARAM)
    postSilentCallbackResult(code)
  }, [])

  return null
}

export default SsoSilentCallback
