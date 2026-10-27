import axios from 'axios'
import { getAuthToken } from '@/lib/auth/token'
import { env } from '@/lib/env'

function initializeAxiosAuthenticationInterceptor() {
  axios.interceptors.request.use((request) => {
    const apiUrl = env.API_URL
    const isApiUrl = apiUrl && request.url && request.url.startsWith(apiUrl)

    const token = getAuthToken()
    if (token && isApiUrl) {
      // axios 0.27 still nests defaults under `common` at this point; its types do not say so.
      const headers = request.headers as { common?: Record<string, string> } | undefined
      if (headers?.common) headers.common.Authorization = `Bearer ${token}`
    }
    return request
  })
}

export default initializeAxiosAuthenticationInterceptor
