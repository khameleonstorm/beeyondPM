import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase/config"
import { useEffect, useState } from "react"
import useAuth from '../hooks/useAuth'


export default function useCollection(coll, allUsers, singleUser, userProjects) {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)
  const { user, authIsReady } = useAuth()
  const [ isPending, setIsPending ] = useState(false)

  useEffect(() => {

    if(authIsReady){
      setIsPending(true)
      let q = query(collection(db, coll), where("uid", "==", user.uid))
  
      if (singleUser) {
        q = query(collection(db, coll), where("uid", "==", user.uid))
      } 

      if (userProjects) {
        q = query(collection(db, coll), where("createdBy.id", "==", user.uid))
      } 
  
      if (allUsers) {
        q = query(collection(db, coll))
      } 
      
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          let results = []
          snapshot.forEach(doc => {
            results.push({ ...doc.data(), id: doc.id})
          })

            // setting doc state
            setDocument(results)
            setError(null)
            setIsPending(false)

        },
        (error) => {
          // ...setting error param
          setError("could not fetch data frm the database.....")
          console.log(error.message)
        });
  
        return () => unsubscribe()
    }
  }, [coll, user, allUsers, singleUser, userProjects, authIsReady])

  return { error, document, isPending }

}
