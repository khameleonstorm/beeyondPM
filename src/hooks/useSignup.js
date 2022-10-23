import { useState, useEffect } from "react"
import { Auth, db, storage } from "../firebase/config"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import useAuth from "./useAuth"
import { useNavigate } from "react-router-dom"


export const useSignup = () => {
    const [isCancelled, setIsCancelled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuth()
    const navigate = useNavigate()

    const signUp = async(email, password, displayName, file) => {
        setError(null)
        setIsPending(true)

        try {

            // sign up user
            const res = await 
            createUserWithEmailAndPassword(Auth, email, password)

            if (!res) {
                throw new Error("Sorry, can't create an account")
            }
            
            const imageRef = ref(storage, `images/${res.user.uid}/${file.name}`)

            // Upload the file and metadata

            const uploadTask = uploadBytesResumable(imageRef, file);

            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused');
                    break;
                  case 'running':
                    console.log('Upload is running');
                    break;
                
                  default:
                    console.log("Uploading..")
                    break;
                }
              }, 
              (error) => {
                // Handle unsuccessful uploads
                setError(error.message)
              }, 
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const imageUrl = downloadURL

                    // update user profile
                    updateProfile(res.user, { displayName: displayName, photoURL: imageUrl })

                    // usetting profile doc
                    const docRef = doc(db, "profile", res.user.uid)
                    setDoc(docRef, {
                      online: true, 
                      displayName, 
                      uid: res.user.uid,
                      photoURL: imageUrl,
                      email: res.user.email,
                    })

                })
              }
            )

            // dispatch login case
            dispatch({type: "LOGIN", payload: res.user})


            if(!isCancelled){
                setIsPending(false)
                setError(null)
            }
            
            navigate("/dashboard")

        } catch (err) {
            if(err){
              console.log(err.message)
              setError(err.message)
              setTimeout(() => {
                setError(null)
              }, 5000);
              setIsPending(false)
            }
        }

    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])


    return { error, isPending, signUp }
}
