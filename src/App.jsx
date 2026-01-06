import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Accommodation from './pages/accommodation'
import SpringFestPortsl from './pages/Music'


import Dashboard from './components/Dashboard'
import { Routes, Route } from "react-router-dom";
import Report from './pages/Report'
import RegisterEvent from './pages/RegisterEvents'
import Profile from './pages/Profile'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SpringFestPortsl/>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Accommodation />} />
        <Route path="/register" element={<RegisterEvent />} />
        <Route path="/report" element={<Report />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>


    </>
  )
}

export default App
