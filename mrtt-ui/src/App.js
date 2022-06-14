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
import CausesOfDeclineForm from './components/CausesOfDeclineForm'
import PreRestorationAssessmentForm from './components/PreRestorationAssessmentForm'
import themeMui from './styles/themeMui'
import Site from './views/Site'

function App() {
  return (
    <ThemeProvider theme={themeMui}>
      <Router>
        <GlobalLayout>
          <CustomToastContainer />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/landscapes' element={<Landscapes />} />
            <Route path='/organizations' element={<Organizations />} />
            <Route path='/site/:siteId' element={<Site />} />
            <Route
              path='/site/:siteId/form/pre-restoration-assessment'
              element={<PreRestorationAssessmentForm />}
            />
            <Route path='/site/:siteId/form/causes-of-decline' element={<CausesOfDeclineForm />} />
            <Route path='/site/:siteId/form/project-details' element={<ProjectDetailsForm />} />
            <Route path='/site/:siteId/form/restoration-aims' element={<RestorationAimsForm />} />
            <Route path='/site/:siteId/form/site-background' element={<SiteBackgroundForm />} />
            <Route path='/sites' element={<Sites />} />
          </Routes>
        </GlobalLayout>
      </Router>
    </ThemeProvider>
  )
}

export default App
