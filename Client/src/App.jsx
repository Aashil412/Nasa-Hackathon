import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppStructure from './Components/AppStructure'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppStructure/>
  )
}

export default App
