import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import Home from './views/Home'
import React from 'react'
import theme from './styles/theme'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className='app'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/:siteId/form/project-details' element={<ProjectDetailsForm />} />
            <Route path='/:siteId/form/site-background' element={<SiteBackgroundForm />} />
            <Route path='/:siteId/form/restoration-aims' element={<RestorationAimsForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
