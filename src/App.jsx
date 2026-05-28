import LogIn from './LogIn.jsx';
import Register from './Register.jsx';
import MealPlan from './MealPlan.jsx';
import GroceryList from './GroceryList.jsx';

import { auth, db } from './firebase';
import { useState, useEffect } from 'react'
import './App.css'
import { onAuthStateChanged,signOut } from 'firebase/auth';
import { doc, getDoc} from 'firebase/firestore'

console.log('Firebase loaded:', auth, db);

function App() {
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState(null)
  const [familyGroupID, setFamilyGroupID] = useState(null)
  const [currentScreen, setCurrentScreen] = useState('meals')

useEffect(() => {
  if (user) {
    getDoc(doc(db, "users", user.uid))
    .then((userDoc) => {
      if(userDoc.exists()){
        setFamilyGroupID(userDoc.data().familyGroupID)
      }
    })
    .catch((error) => console.log("Error fetching the user doc:", error.message))
  } else {
    setFamilyGroupID(null)
  }
}, [user])

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
  }, [])

   function handleSignOut() {
    signOut(auth)
    .then(() => console.log("Signed Out"))
    .catch((error) => console.log("Sign out error:", error.message))
   }

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.email} !</h2>
          
          {currentScreen === 'meals' && <MealPlan familyGroupID={familyGroupID} />}
          {currentScreen === 'grocery' && <GroceryList familyGroupID={familyGroupID} />}
          
          <div>
              <button onClick={() => setCurrentScreen('meals')}>Meals</button>
              <button onClick={() => setCurrentScreen('grocery')}>Grocery</button>
          </div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>

      ) : (
        <div>
          {showRegister ? <Register/> : <LogIn />}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Already have an account? Sign In' : 'New here? Register'}
        </button>
        </div>


      )}
    </div>
  )
}

export default App
