import axios from 'axios'
import { env } from '@/lib/env'

let _token: string | null = null

export function setAuthToken(token: string | null) {
  _token = token
}

export function getAuthToken() {
  return _token
}

function initializeAxiosAuthenticationInterceptor() {
  axios.interceptors.request.use((request) => {
    const apiUrl = env.API_URL
    const isApiUrl = apiUrl && request.url && request.url.startsWith(apiUrl)

    if (_token && isApiUrl) {
      // axios 0.27 still nests defaults under `common` at this point; its types do not say so.
      const headers = request.headers as { common?: Record<string, string> } | undefined
      if (headers?.common) headers.common.Authorization = `Bearer ${_token}`
    }
    return request
  })
}

export default initializeAxiosAuthenticationInterceptor
