import LogIn from './LogIn.jsx';
import Register from './Register.jsx';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './firebase';
console.log('Firebase loaded:', auth, db);
import { useState } from 'react'
import './App.css'

function App() {
  const [showRegister, setShowRegister] = useState(false)
  return (
    <div>
      {showRegister ? <Register/> : <LogIn />}
      <button onClick={() => setShowRegister(!showRegister)}>
        {showRegister ? 'Already have an account? Sign In' : 'New here? Register'}
      </button>
    </div>
  )
}

export default App
