import axios from 'axios'
import isAuthenticated from './isAuthenticated'

function interceptor() {
  axios.interceptors.request.use((request) => {
    const token = localStorage.getItem('token')
    const isAuthed = isAuthenticated()
    const isApiUrl = request.url.startsWith(`${process.env.REACT_APP_API_URL}`)

    if (isAuthed && isApiUrl) {
      request.headers.common.Authorization = `Bearer ${token}`
    }
    return request
  })
}

export default interceptor
