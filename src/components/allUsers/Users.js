import styles from './Users.module.css'
import IMG from "../../assets/profile-logo.gif"
import { useState } from 'react'
import { FaCircle } from "react-icons/fa"
import { MoonLoader } from 'react-spinners'
import Chat from '../chat/Chat'
import useAuth from '../../hooks/useAuth'
import { db } from "../../firebase/config"
import { useFirestore } from '../../hooks/useFirestore'
import { collection, onSnapshot, where, query } from "firebase/firestore";
import useCollection from '../../hooks/useCollection'


export default function Users() {
  const [showChat, setShowChat] = useState(false)
  const [receiver, setReceiver] = useState(null)
  const { user, dispatch } = useAuth()
  const { addDocument } = useFirestore('chats')
  const q = query(collection(db, "chats"), where("users", "array-contains", user.uid))
  const [chat, setChat] = useState(null)
  const { document: allUsers, error, isPending } = useCollection("profile", true, false)


  const handleChat = (selectedUser) => {
    if(selectedUser.uid !== user.uid){
      setReceiver(selectedUser)
      setShowChat(true)

      dispatch({ type: 'HIDE_MENU', payload: true })

      onSnapshot(q, 
        (snapshot) => {
          const checkChat = !!snapshot.docs.find(chat => chat.data().users?.find(user => user === selectedUser.uid)?.length > 0)
          checkChat ?
          setChat(snapshot.docs.find(chat => chat.data().users?.find(user => user === selectedUser.uid))) : 
          addDocument({ users: [user.uid, selectedUser.uid], messages: [] })
        }
      )
    }
  }

  const handleChatClose = () => {
    setReceiver(null)
    setShowChat(false)
    setChat(null)
    dispatch({ type: 'HIDE_MENU', payload: false })
  }


  return (
    <>
    {showChat && <Chat 
    closeChat={handleChatClose} 
    receiver={receiver}
    chat={chat?.data()} 
    chatId={chat?.id}
    />}
    <div className={styles.container}>
      {isPending && <MoonLoader size={20} color="#95c8ff" className={styles.spin}/>}
      {error && <div>can't fetch users at the moment...</div>}

      {allUsers?.map((user) => 
        <div className={styles.users} key={user.uid} onClick={() => handleChat(user)}>
          <span><p>{user.displayName}</p></span>
          <div>
            <FaCircle size="0.55em" color={user.online ? "#0daf97" : "#e8e8e8"}/>
            <img src={user.photoURL ? user.photoURL :IMG} alt="avatar" />
          </div>
        </div>
      )}
    </div>
    </>
  )
}