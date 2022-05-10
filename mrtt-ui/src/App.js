import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import ProjectDetailsForm from './components/ProjectDetailsForm'
import SiteBackgroundForm from './components/SiteBackgroundForm'
import { ThemeProvider } from '@mui/material/styles'
import theme from './styles/theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className='app'>
          <Routes>
            <Route path='/' element={[<Home key='1'></Home>]}></Route>
            <Route
              path='/project-details'
              element={<ProjectDetailsForm key='2'></ProjectDetailsForm>}></Route>
            <Route
              path='/site-background'
              element={<SiteBackgroundForm key='2'></SiteBackgroundForm>}></Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
