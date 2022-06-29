import axios from 'axios'

function interceptor() {
  axios.interceptors.request.use((request) => {
    const token = localStorage.getItem('token')
    const isApiUrl = request.url.startsWith(`${process.env.REACT_APP_API_URL}`)

    if (token && isApiUrl) {
      request.headers.common.Authorization = `Bearer ${token}`
    }
    return request
  })
}

export default interceptor
