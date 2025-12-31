import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Accommodation from './pages/accommodation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Accommodation/>
    </>
  )
}

export default App
