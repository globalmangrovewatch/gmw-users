import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'

import { CustomToastContainer } from './components/CustomToastContainer'
import CausesOfDeclineForm from './components/CausesOfDeclineForm'
import GlobalLayout from './components/GlobalLayout'
import LandscapeForm from './views/LandscapeForm'
import Landscapes from './views/Landscapes'
import LoginForm from './views/Auth/LoginForm'
import OrganizationForm from './views/OrganizationForm'
import Organizations from './views/Organizations'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import ProtectedRoutes from './components/Auth/ProtectedRoutes'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'
import SignupForm from './views/Auth/SignupForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import SiteForm from './views/SiteForm'
import SiteQuestionsOverview from './views/SiteQuestionsOverview/SiteQuestionsOverview'
import Sites from './views/Sites'
import themeMui from './styles/themeMui'

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
              <Route
                path='/landscapes/:landscapeId/edit'
                element={<LandscapeForm isNewLandscape={false} />}
              />
              <Route path='/landscapes/new' element={<LandscapeForm isNewLandscape={true} />} />
              <Route path='/organizations' element={<Organizations />} />
              <Route
                path='/organizations/:organizationId/edit'
                element={<OrganizationForm isNewOrganization={false} />}
              />
              <Route
                path='/organizations/new'
                element={<OrganizationForm isNewOrganization={true} />}
              />
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
              <Route path='/sites' element={<Sites />} />
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
