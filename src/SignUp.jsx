import { auth } from './firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { use, useState } from "react";
function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    function handleSubmit(e) {
        e.preventDefault()
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Account created:', userCredential.user.email)
            setMessage('Account successfully created!')
        })
        .catch((error) => {
            console.log('Error:', error.message)
            setMessage(error.message)
        })
    }
    return(
        <div>
            <form onSubmit = {handleSubmit}>
                 <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                 <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                 <button type="submit">Sign Up</button>
            </form>
            <p>{message}</p>
        </div>
    )
}
export default SignUp