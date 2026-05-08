import { auth } from './firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
function Register() {
    const [fullName, setfullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [familyCode, setFamilyCode] = useState('')
    function handleSubmit(e) {
        e.preventDefault()

        if (password !== repeatPassword) {
            setMessage( 'Passwords do not match')
        return
        }

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
                 <input type="text" placeholder="Enter Full Name" value={fullName} onChange={(e) => setfullName(e.target.value)}/>
                 <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                 <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                 <input type="password" placeholder="Repeat password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>
                 <input type="text" placeholder="Enter family code" value={familyCode} onChange={(e) => setFamilyCode(e.target.value)}/>
                 <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>
    )
}
export default Register