import { IoSend } from 'react-icons/io5'
import styles from './Comment.module.css'
import { TiCamera } from 'react-icons/ti'
import { useRef, useState } from 'react'
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db, storage } from '../../firebase/config';
import { MoonLoader } from 'react-spinners'

export default function Comment({project, user}) {
  const [img, setImg] = useState(null)
  const [imgError, setImgError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [comment, setComment] = useState('')
  const hiddenFileInput = useRef(null)
  const createdAt = new Date().toLocaleString()
  const [isPending, setIsPending] = useState(false)
  const [imgUploadError, setImgUploadError] = useState(null)

  const handleClick = () => {
    hiddenFileInput.current.click();
  }

  const handleImage = (e) => {
    setImgError(null)
    const selected = e.target.files[0]
    if (!selected) {
      setImgError("File can't be empty")
      setTimeout(() => {
        setImgError(null)
      }, 3000)
      return
    }

    if (selected.size > 5000000) {
      setImgError("File size is too large")
      setTimeout(() => {
        setImgError(null)
      }, 3000)
      return
    }

    setImg(selected)
    setImgError(null)
  }



  const handleSubmit = async() => {
    setIsPending(true)
    setFormError(null)

    if (comment === "" && !img) {
      setFormError("Comment can't be empty")
      setTimeout(() => {
        setFormError(null)
        setIsPending(false)
      }, 3000)
      return
    }

    if (comment !== "" && img) {
      const imageRef = ref(storage, `images/${user.uid}/${img.name}`)
      const uploadTask = uploadBytesResumable(imageRef, img)
      

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
              setIsPending(true)
              break;
          
            default:
              console.log("Uploading..")
              break;
          }
        }, 
        (error) => {
          setImgUploadError(error.message)
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsPending(false)
            const ref = doc(db, "projects", project.id)
              const createdBy = {
                id: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL
              }
        
              const newComment = {
                comment,
                imageUrl: downloadURL,
                createdBy,
                createdAt,
                reply: [],
              }
        
              updateDoc(ref, {
                comments: arrayUnion(newComment)
              })
          })
        }
      )
      setIsPending(false)
    }

    if (comment !== "" && !img) {
    setIsPending(true)
    const ref = doc(db, "projects", project.id)

      const createdBy = {
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL
      }

      const newComment = {
        comment,
        createdBy,
        createdAt,
        reply: [],
      }

      await updateDoc(ref, {
        comments: arrayUnion(newComment)
      })
      setIsPending(false)
    }
    
    setIsPending(false)
    setComment('')
    setImg(null)
  }


  return (
    <>
      <div className={styles.container}>
      <div className={styles.comment}>
        <input type="text" placeholder="Add a comment..." required onChange={e => setComment(e.target.value)} value={comment}/>
        {isPending ? 
          <MoonLoader size={17} color="#036ee1" className={styles.spin}/> : 
          <IoSend className={styles.send} onClick={handleSubmit}/>}
        <div>
          <input hidden accept="image/*" type="file" ref={hiddenFileInput} onChange={handleImage}/>
          <TiCamera color={img ? "#00a45de6" : "#000000"} className={styles.file} onClick={handleClick}/>
        </div>
      </div>
      {imgError && <p className={styles.error}>{imgError}</p>}
        {formError && <p className={styles.error}>{formError}</p>}
      {imgUploadError && <p className={styles.error}>{imgUploadError}</p>}
      </div>
    </>
  )
}
