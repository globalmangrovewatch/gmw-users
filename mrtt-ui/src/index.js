import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import interceptor from './library/auth/interceptor'
import { AuthProvider } from './hooks/useAuth'

const root = ReactDOM.createRoot(document.getElementById('root'))
interceptor()
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
