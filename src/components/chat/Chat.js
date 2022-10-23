import styles from './Chat.module.css'
import Picker from 'emoji-picker-react'
import { useState } from 'react'
import { BsEmojiSmile } from "react-icons/bs"
import { IoIosClose } from "react-icons/io"
import { AiOutlineSend } from "react-icons/ai"
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config"
import useAuth from '../../hooks/useAuth'
import { IoSend } from "react-icons/io5";


export default function Chat({closeChat, receiver, chatId, chat}) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [message, setMessage] = useState("")
  const createdAt = new Date().toLocaleString()
  const { user } = useAuth()


  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const onEmojiClick = (e, emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji)
    setShowEmoji(false)
  }

  const keyPressed = (e) => {
    if(e.keyCode === 13) { 
      handleSubmit()
    }
  }

  const handleSubmit = () => {

    if(message !== ""){
      const ref = doc(db, "chats" , chatId)

      const createdBy = {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
  
      const newMessage = {
        message,
        createdBy,
        createdAt,
      }
  
      updateDoc(ref, {
        messages: arrayUnion(newMessage)
      })
  
      setMessage("")
    }
  }


  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          {receiver.uid && <img src={`https://robohash.org/${receiver.uid}`} alt="avatar" className={styles.avatar}/>}
          <p>{receiver.displayName}</p>
          <IoIosClose size="2.2em" color="#f9f1ff" className={styles.close} onClick={() => closeChat()}/>
        </div>

        <div className={styles.chat}>   
          {chat?.messages.map(message =>
          <div className={message.createdBy.id !== user.uid? styles.receiver : styles.sender} key={message.createdAt}>
            <p>{message.createdBy.displayName}</p>
            <p>{message.message}</p>
          </div>
          )}
        </div>

      <div className={styles.inputBox}>
          {showEmoji && 
          <Picker 
          onEmojiClick={onEmojiClick} 
          preload={true}
          pickerStyle={{ width: '90%',
            height: '250px', 
            position: 'absolute', 
            bottom: '60px', 
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: '1000',
            background: '#faf4ffeb', 
            boxShadow: '0 0 3px 0 #00000019',
            border: 'none',
            borderRadius: '15px',
          }}
          />}
          <BsEmojiSmile onClick={() => setShowEmoji(!showEmoji)} className={styles.emoji}/>
          <input type="text" placeholder="type a message" onChange={handleChange} value={message} onKeyDown={keyPressed}/>
          <AiOutlineSend  onClick={handleSubmit} className={styles.send}/>
          {!(message === "") && 
          <div className={styles.send2} onClick={handleSubmit}>
             <IoSend className={styles.sendActive}/>
          </div>}
        </div>
      </div>
    </div>
  )
}
