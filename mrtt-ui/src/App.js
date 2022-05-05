import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './views/Home'
import ProjectDetailsForm from './components/ProjectDetailsForm/ProjectDetailsForm'

function App() {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route
            path='/'
            element={[
              <Home key='1'></Home>,
              <ProjectDetailsForm key='2'></ProjectDetailsForm>
            ]}></Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
