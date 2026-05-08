import LogIn from './LogIn.jsx';
import Register from './Register.jsx';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './firebase';
console.log('Firebase loaded:', auth, db);
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Register />
      <LogIn />
    </div>
  )
}

export default App
