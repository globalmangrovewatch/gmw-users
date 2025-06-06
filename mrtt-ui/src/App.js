import 'react-toastify/dist/ReactToastify.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { CustomToastContainer } from './components/CustomToastContainer'
import CausesOfDeclineForm from './components/CausesOfDeclineForm'
import CostsForm from './components/Costs/CostsForm'
import EcologicalStatusAndOutcomesForm from './components/EcologicalStatusAndOutcomes/EcologicalStatusAndOutcomesForm'
import ForgotPasswordForm from './views/Auth/ForgotPasswordForm'
import GlobalLayout from './components/GlobalLayout'
import LandscapeForm from './views/LandscapeForm'
import Landscapes from './views/Landscapes'
import LoginForm from './views/Auth/LoginForm'
import ManagementStatusAndEffectivenessForm from './components/ManagementStatusAndEffectiveness/ManagementStatusAndEffectivenessForm'
import ManageOrganizationUsers from './views/ManageOrganizationUsers'
import NewOrganizationUser from './views/NewOrganizationUser'
import OrganizationForm from './views/OrganizationForm'
import Organizations from './views/Organizations'
import PageNotFound from './views/PageNotFound'
import PreRestorationAssessmentForm from './components/PreRestorationAssessment/PreRestorationAssessmentForm'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import ProtectedRoutes from './components/Auth/ProtectedRoutes'
import ResetPasswordForm from './views/Auth/ResetPasswordForm'
import RestorationAimsForm from './components/RestorationAimsForm/RestorationAimsForm'
import SignupForm from './views/Auth/SignupForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import SiteForm from './views/SiteForm'
import SiteInterventionsForm from './components/SiteInterventions/SiteInterventionsForm'
import SiteQuestionsOverview from './views/SiteQuestionsOverview/SiteQuestionsOverview'
import Sites from './views/Sites'
import SocioeconomicAndGovernanceStatusAndOutcomesForm from './components/SocioeconomicAndGovernance/SocioeconomicAndGovernanceStatusAndOutcomesForm'
import themeMui from './styles/themeMui'
import FormWrapperProvider from './components/FormWrapper/FormWrapperProvider'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  })
}

let browserQueryClient = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

function App() {
  const queryClient = getQueryClient()
  return (
    <ThemeProvider theme={themeMui}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <GlobalLayout>
            <CustomToastContainer />
            <FormWrapperProvider>
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
                    path='/organizations/:organizationId/users'
                    element={<ManageOrganizationUsers />}
                  />
                  <Route
                    path='/organizations/:organizationId/users/new'
                    element={<NewOrganizationUser />}
                  />
                  <Route
                    path='/organizations/new'
                    element={<OrganizationForm isNewOrganization={true} />}
                  />
                  <Route path='/sites/:siteId/edit' element={<SiteForm isNewSite={false} />} />
                  <Route path='/sites/:siteId/form/costs' element={<CostsForm />} />
                  <Route
                    path='/sites/:siteId/form/site-interventions'
                    element={<SiteInterventionsForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/pre-restoration-assessment'
                    element={<PreRestorationAssessmentForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/causes-of-decline'
                    element={<CausesOfDeclineForm />}
                  />
                  <Route path='/sites/:siteId/form/costs' element={<CostsForm />} />
                  <Route
                    path='/sites/:siteId/form/management-status-and-effectiveness'
                    element={<ManagementStatusAndEffectivenessForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/management-status-and-effectiveness/:monitoringFormId'
                    element={<ManagementStatusAndEffectivenessForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/socioeconomic-and-governance-status'
                    element={<SocioeconomicAndGovernanceStatusAndOutcomesForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/socioeconomic-and-governance-status/:monitoringFormId'
                    element={<SocioeconomicAndGovernanceStatusAndOutcomesForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/ecological-status-and-outcomes'
                    element={<EcologicalStatusAndOutcomesForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/ecological-status-and-outcomes/:monitoringFormId'
                    element={<EcologicalStatusAndOutcomesForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/project-details/'
                    element={<ProjectDetailsForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/restoration-aims'
                    element={<RestorationAimsForm />}
                  />
                  <Route
                    path='/sites/:siteId/form/site-background'
                    element={<SiteBackgroundForm />}
                  />
                  <Route path='/sites/:siteId/overview' element={<SiteQuestionsOverview />} />
                  <Route path='/sites/new' element={<SiteForm isNewSite={true} />} />
                  <Route path='/sites' element={<Sites />} />
                </Route>

                <Route path='/auth/signup' element={<SignupForm />} />
                <Route path='/auth/login' element={<LoginForm />} />
                <Route path='/auth/login/newUser' element={<LoginForm isUserNew={true} />} />
                <Route path='auth/password/forgot-password' element={<ForgotPasswordForm />} />
                <Route path='auth/password/reset/' element={<ResetPasswordForm />} />
                <Route path='*' element={<PageNotFound />} />
              </Routes>
            </FormWrapperProvider>
          </GlobalLayout>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
