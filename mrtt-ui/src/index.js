import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import initializeAxiosAuthenticationInterceptor from './library/auth/interceptor'
import { AuthProvider } from './hooks/useAuth'

const root = ReactDOM.createRoot(document.getElementById('root'))
initializeAxiosAuthenticationInterceptor()
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
