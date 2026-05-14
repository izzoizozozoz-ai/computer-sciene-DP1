import { auth } from './firebase'
import { signInWithEmailAndPassword } from "firebase/auth";
import { use, useState } from "react";
function LogIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    function handleSubmit(e) {
        e.preventDefault()
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Account created:', userCredential.user.email)
            setMessage('Logged in successfully!')
        })
        .catch((error) => {
            console.log('Error:', error.message)
            setMessage(error.message)
        })
    }
    return(
        <div>
            <h2>Log in</h2>
            <form onSubmit = {handleSubmit}>
                 <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                 <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                 <button type="submit">Log In</button>
            </form>
            <p>{message}</p>
        </div>
    )
}
export default LogIn