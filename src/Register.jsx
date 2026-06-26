import {doc, setDoc, getDoc, updateDoc, arrayUnion} from 'firebase/firestore'
import { db } from './firebase'
import { auth } from './firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

function generateFamilyCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 6; i+=1) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        const randomChar = characters.charAt(randomIndex)
        code += randomChar
    }
    return code
}

function Register() {
    const [fullName, setfullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [familyCode, setFamilyCode] = useState('')
    function handleSubmit(e) {
        e.preventDefault()
        
        if (fullName === '') {
            setMessage('Please enter your full name')
        return
        }

        if (email === '') {
            setMessage('Please enter your email')
        return
        }

        if (password === '') {
            setMessage('Please enter your password')
        return
        }

        if (repeatPassword === '') {
            setMessage('Please repeat your password')
        return
        }

        if (password !== repeatPassword) {
            setMessage( 'Passwords do not match')
        return
        }

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('Account created:', userCredential.user.email)
            setMessage('Account successfully created!')
            const userID = userCredential.user.uid
            
            if (familyCode === '') {
                const newCode = generateFamilyCode()
                
                setDoc(doc(db, "families", newCode), {
                    groupCode: newCode,
                    memberIDs: [userID],
                    createdBy: userID
                })
                .then(() => console.log("Family created: ", newCode))
                .catch((error) => console.log("Family error:", error.message))
                
                setDoc(doc(db, "users", userCredential.user.uid), {
                    email: email,
                    fullName: fullName,
                    familyGroupID: newCode
                })
                .then(() => console.log("User document created"))
                .catch((error) => console.log("Firestore error:", error.message))
            } else {
            getDoc(doc(db, "families", familyCode))
            .then((familyDoc) => {
                if (familyDoc.exists()) {
                    updateDoc(doc(db, "families", familyCode), {
                        memberIDs: arrayUnion(userID)
                    })
                    .then(() => console.log("Joined family:", familyCode))
                    .catch((error) => console.log("Update error", error.message))
                    
                    setDoc(doc(db, "users", userCredential.user.uid), {
                        email: email,
                        fullName: fullName,
                        familyGroupID: familyCode
                    })
                    .then(() => console.log("Joined family:", familyCode))
                    .catch((error) => console.log("User document created", error.message))
                } else {
                    setMessage("Incorrect family code")
                
                }
            })
            .catch((error) => console.log("Lookup error:", error.message))
            }
        })       
        .catch((error) => {
            console.log('Error:', error.message)
            setMessage(error.message)
        })    
    }
    return(
        <div>
            <h2>Register</h2>
            <form onSubmit = {handleSubmit}>
                 <input type="text" placeholder="Enter Full Name" value={fullName} onChange={(e) => setfullName(e.target.value)}/>
                 <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                 <input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                 <input type="password" placeholder="Repeat password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}/>
                 <input type="text" placeholder="Enter family code" value={familyCode} onChange={(e) => setFamilyCode(e.target.value)}/>
                 <button type="submit">Register</button>
            </form>
            <p>{message}</p>
        </div>)
}
export default Register
