import { useEffect } from 'react'
import { postSilentCallbackResult, SSO_CODE_PARAM } from 'hooks/sso'

const SsoSilentCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get(SSO_CODE_PARAM)
    postSilentCallbackResult(code)
  }, [])

  return null
}

export default SsoSilentCallback
