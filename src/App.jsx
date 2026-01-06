import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Accommodation from './pages/accommodation'
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";



import Dashboard from './components/Dashboard'
import { Routes, Route, Navigate } from "react-router-dom";
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
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/register" element={<RegisterEvent />} />
        <Route path="/report" element={<Report />} />
        <Route path='/profile' element={<Profile />} />

         {/* 🔹 Default route */}
        <Route path="/" element={<Navigate to="/signin" replace />} />

        {/* 🔹 Auth routes */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

      </Routes>


    </>
  )
}

export default App
