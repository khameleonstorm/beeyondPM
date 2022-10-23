import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from '../../firebase/config';
import { Fragment, useEffect, useState } from 'react';
import { RiHeartFill, RiHeartLine } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useCollection from '../../hooks/useCollection'
import SideNav from '../sideNav/SideNav'
import Users from '../allUsers/Users'
import styles from './ProjectDetails.module.css'
import Comment from "../comment/Comment";
import { MoonLoader } from "react-spinners";

export default function ProjectDetails() {
  const { id } = useParams()
  const { user, authIsReady } = useAuth()
  const allUsers = true
  const singleUser = false
  const userProjects = false
  const { document, error, isPending } = useCollection("projects", allUsers, singleUser, userProjects)
  const [project, setProject] = useState(null)
  const [sorted, setSorted] = useState([])
  const [likeIsPending, setLikeIsPending] = useState(false)

  const handleLike = async () => {
    setLikeIsPending(true)
    const ref = doc(db, "projects", project.id)
    const isLiked = project.like.find(doc => Object.keys(doc)[0] === user.uid)
    const likeID = Object.keys(isLiked)[0]
    const likeStatus = Object.values(isLiked)[0]
    const newLike = {
      [user.uid] : !likeStatus
    }
    const newLike2 = {
      [user.uid] : true
    }

    if(likeID === user.uid){
      await updateDoc(ref, {
        like: arrayRemove(isLiked)
      })

      await updateDoc(ref, {
        like: arrayUnion(newLike)
      })

    } else {
      await updateDoc(ref, {
        like: arrayUnion(newLike2)
      })
    }
    setLikeIsPending(false)
  }


  useEffect(() => {
    if(document){
      const doc = document.find(project => project.id === id)
      setProject(doc)
        const sortedArr = doc.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setSorted(sortedArr)
    }
  }, [document, id, error])


  return (authIsReady &&
    <div className={styles.container}>
      <div className={styles.sideNav}>
        <SideNav user={user}/>
      </div>
      {project &&
        <div className={styles.main}>
          <div className={styles.mainWrapper}>
          {isPending && <MoonLoader size={20} color="#006de2" className={styles.spin}/>}
          <h1 className={styles.title}>
            {project.projectName}
            <img src={`https://robohash.org/${project.createdBy.id}`} alt="avatar" className={styles.avatar}/>
          </h1> 
          <p className={styles.desc}>
            {project.projectDesc}
          </p>
          <div className={styles.stats}>
            <div className={styles.team}>
              {project.projectTeam && project.projectTeam.map((member) => <img key={member.id} src={member.photoURL} alt='avatar'/>)}
            </div>
            <div className={styles.likes}>
              {project.like && project.like.map(objID =>
              <Fragment key={Math.random()}>
              {(Object.keys(objID)[0] === user.uid && Object.values(objID)[0] === true ) && 
                <RiHeartFill onClick={handleLike} size="1.2em" color="#FF205F" className={styles.like} />
              }
              {(Object.keys(objID)[0] === user.uid && Object.values(objID)[0] === false ) && 
                <RiHeartLine onClick={handleLike} size="1.2em" color='#0C1C1F' className={styles.like}/>
              }
              {likeIsPending && 
                <RiHeartLine onClick={handleLike} size="1.2em" color='#FF205F' className={styles.like}/>
              }
              </Fragment>              
              )}
            </div>
          </div> 
          <Comment user={user} project={project}/>

          {sorted && sorted.map(comment => 
            <div className={styles.comments} key={comment.createdAt}>
              <p>{comment.comment}</p>
              {comment.imageUrl && <img src={comment.imageUrl} alt="commentImage" className={styles.commentImage}/>}
              <img src={`https://robohash.org/${comment.createdBy.id}`} alt="avatar" className={styles.avatar}/>
            </div>
          )}
          </div>
      </div>
      }
      <div className={styles.users}>
        <Users />
      </div>
    </div>
  )
}
