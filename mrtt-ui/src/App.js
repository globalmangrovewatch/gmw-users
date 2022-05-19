import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import Home from './views/Home'
import React from 'react'

import { CustomToastContainer } from './components/CustomToastContainer'
import GlobalLayout from './components/GlobalLayout'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'
import theme from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalLayout>
        <CustomToastContainer />
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/:siteId/form/project-details' element={<ProjectDetailsForm />} />
            <Route path='/:siteId/form/restoration-aims' element={<RestorationAimsForm />} />
          </Routes>
        </Router>
      </GlobalLayout>
    </ThemeProvider>
  )
}

export default App
