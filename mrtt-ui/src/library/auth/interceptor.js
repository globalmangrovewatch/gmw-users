import axios from 'axios'

let _token = null

export function setAuthToken(token) {
  _token = token
}

export function getAuthToken() {
  return _token
}

function initializeAxiosAuthenticationInterceptor() {
  axios.interceptors.request.use((request) => {
    const apiUrl = process.env.REACT_APP_API_URL
    const isApiUrl = apiUrl && request.url && request.url.startsWith(apiUrl)

    if (_token && isApiUrl) {
      request.headers.common.Authorization = `Bearer ${_token}`
    }
    return request
  })
}

export default initializeAxiosAuthenticationInterceptor
