import useCollection from '../../hooks/useCollection'
import styles from './Projects.module.css'
import { RiHeartLine, RiHeartFill } from 'react-icons/ri'
import { AiOutlineComment } from 'react-icons/ai'
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase/config';
import { Fragment, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MoonLoader } from "react-spinners";



export default function Projects({all, favourite}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const allUsers = all ? true : false
  const singleUser = false
  const userProjects = !all ? true : false
  const [filtered , setFiltered] = useState([])
  const { isPending, document } = useCollection("projects", allUsers, singleUser, userProjects)
  const [checkIsFavourite, setCheckIsFavourite] = useState(null)
  const [isLiked, setIsLiked] = useState(null)


  const handleLike = (id) => {
    const ref = doc(db, "projects", id)
    onSnapshot(doc(db, "projects", id), (doc) => {
      const checkIsLiked = !!doc.data().like.find(doc => Object.keys(doc)[0] === user.uid)
      setIsLiked(doc.data().like.find(doc => Object.keys(doc)[0] === user.uid))
      setCheckIsFavourite(checkIsLiked)
    })

    if(checkIsFavourite){
      const likeStatus = Object.values(isLiked)[0]
      const newLike = {
        [user.uid] : !likeStatus
      }

      updateDoc(ref, {
        like: arrayRemove(isLiked)
      })

      updateDoc(ref, {
        like: arrayUnion(newLike)
      })
    }

    if(!checkIsFavourite){
      const newLike = {
        [user.uid] : true
      }

      updateDoc(ref, {
        like: arrayUnion(newLike)
      })
    }

    setIsLiked(null)
    setCheckIsFavourite(null)
  }



  useEffect(() => {
    if(document){
      if(favourite){
        const doc = document.filter(project => project.like.find(fav => Object.values(fav)[0] === true && Object.keys(fav)[0] === user.uid))
        setFiltered(doc)
      } else{
        setFiltered(document)
      }
    }  
  }, [document, favourite, user, ])




  return (filtered.length > 0 &&
    <div className={styles.container}>
      {isPending && <MoonLoader size={30} color="#006de2" className={styles.spinner}/>}
      {filtered?.map((doc) => 
        <div className={styles.card} key={doc.id}>
            <img src={`https://robohash.org/${doc.createdBy.id}`} alt="avatar" className={styles.avatar}/>
            <h1 className={styles.title} onClick={() => navigate(`/dashboard/project/${doc.id}`, { replace: true })}>
              {doc.projectName.length > 27 ? doc.projectName.substring(0, 25) + ".." : doc.projectName}
            </h1>
            <p className={styles.dueDate}>{doc.createdAt}</p>
            <p className={styles.desc} onClick={() => navigate(`/dashboard/project/${doc.id}`, { replace: true })}>
              {doc.projectDesc.length > 95 ? doc.projectDesc.substring(0, 92) + "..." : doc.projectDesc}
            </p>
            <div className={styles.team}>
              {doc.projectTeam.map((member) => <img key={member.id} src={member.photoURL} alt='avatar'/>)}

              <AiOutlineComment color='#0C1C1F' size="1.2em" className={styles.comment} 
              onClick={() => navigate(`/dashboard/project/${doc.id}`, { replace: true })}/>

              {doc.like.length > 0 && 
                doc.like.map(objID => 
                <Fragment key={Math.random()}>
                  {(Object.keys(objID)[0] === user.uid && Object.values(objID)[0] === true) ?
                    <RiHeartFill onClick={() => handleLike(doc.id)} size="1.2em" color='#FF205F' className={styles.like}/> :
                    <RiHeartLine onClick={() => handleLike(doc.id)} size="1.2em" color='#0C1C1F' className={styles.like2}/>
                  }
                </Fragment>
              )}

              {doc.like.length < 1 && <RiHeartLine onClick={() => handleLike(doc.id)} size="1.2em" color='#0C1C1F' className={styles.like}/>}
            </div>
        </div>
      )}
    </div>
  )
}
