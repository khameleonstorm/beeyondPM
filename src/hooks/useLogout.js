import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import { Auth, db } from "../firebase/config";
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { doc, updateDoc } from "firebase/firestore"; 

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const { dispatch } = useAuth()
    const navigate = useNavigate()
    const { user } = useAuth()

    // creating a logout function
    const logout = async () => {
        setError(null)
        const docRef = doc(db, 'profile', user.uid)

        try {
            await updateDoc(docRef, {online: false})

            await signOut(Auth)

            // dispatching a logout function
            dispatch({ type: "LOGOUT" })
            navigate('/login')

            if(!isCancelled){
                setError(null)
            }
        } catch (err) {
            if(!isCancelled){
                console.log(err.message)
                setError(err.message)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { error, logout }
    
}