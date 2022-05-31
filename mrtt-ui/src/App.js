import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'

import Home from './views/Home'
import Landscapes from './views/Landscapes'
import Sites from './views/Sites'
import Organizations from './views/Organizations'

import { CustomToastContainer } from './components/CustomToastContainer'
import GlobalLayout from './components/GlobalLayout'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'
import theme from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalLayout>
          <CustomToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/:siteId/form/project-details' element={<ProjectDetailsForm />} />
            <Route path='/:siteId/form/site-background' element={<SiteBackgroundForm />} />
            <Route path='/:siteId/form/restoration-aims' element={<RestorationAimsForm />} />
            <Route path='/sites' element={<Sites />} />
            <Route path='/organizations' element={<Organizations />} />
            <Route path='/landscapes' element={<Landscapes />} />
          </Routes>
        </GlobalLayout>
      </Router>
    </ThemeProvider>
  )
}

export default App
