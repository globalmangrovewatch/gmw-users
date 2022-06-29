import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'

import { CustomToastContainer } from './components/CustomToastContainer'
import CausesOfDeclineForm from './components/CausesOfDeclineForm'
import GlobalLayout from './components/GlobalLayout'
import Landscapes from './views/Landscapes'
import Organizations from './views/Organizations'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import SiteForm from './views/SiteForm'
import SignupForm from './views/Auth/SignupForm'
import LoginForm from './views/Auth/LoginForm'
import SiteQuestionsOverview from './views/SiteQuestionsOverview/SiteQuestionsOverview'
import Sites from './views/Sites'
import themeMui from './styles/themeMui'
import ProtectedRoutes from './components/Auth/ProtectedRoutes'

function App() {
  return (
    <ThemeProvider theme={themeMui}>
      <Router>
        <GlobalLayout>
          <CustomToastContainer />
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path='/' element={<Navigate to='/sites' replace />} />
              <Route path='/landscapes' element={<Landscapes />} />
              <Route path='/organizations' element={<Organizations />} />
              <Route path='/sites' element={<Sites />} />
              <Route path='/site/:siteId/edit' element={<SiteForm isNewSite={false} />} />
              <Route
                path='/site/:siteId/form/causes-of-decline'
                element={<CausesOfDeclineForm />}
              />
              <Route path='/site/:siteId/form/project-details' element={<ProjectDetailsForm />} />
              <Route path='/site/:siteId/form/restoration-aims' element={<RestorationAimsForm />} />
              <Route path='/site/:siteId/form/site-background' element={<SiteBackgroundForm />} />
              <Route path='/site/:siteId/overview' element={<SiteQuestionsOverview />} />
              <Route path='/site/new' element={<SiteForm isNewSite={true} />} />
            </Route>

            <Route path='/auth/signup' element={<SignupForm />} />
            <Route path='/auth/login' element={<LoginForm />} />
          </Routes>
        </GlobalLayout>
      </Router>
    </ThemeProvider>
  )
}

export default App
