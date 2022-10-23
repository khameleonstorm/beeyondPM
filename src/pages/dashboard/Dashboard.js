//Components
import Users from '../../components/allUsers/Users'
import SideNav from '../../components/sideNav/SideNav'
import Profile from '../../components/profile/Profile'
import Projects from '../../components/projects/Projects'
import Favourite from '../../components/favourite/Favourite'
import ProjectForm from '../../components/projectForm/ProjectForm'

//Styles
import styles from "./Dashboard.module.css"
//Hooks and functions
import useAuth from '../../hooks/useAuth'
import useCollection from '../../hooks/useCollection'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react'

export default function Dashboard() {
  const { page } = useParams()
  const { user, authIsReady, hideMenu, showChat, dispatch } = useAuth()
  const allUsers = true
  const singleUser = false
  const { document, error, isPending } = useCollection("profile", allUsers, singleUser)

  useEffect(() => {
    if(page === "chat"){
      dispatch({type: "SHOW_CHAT", payload: true})
    } else{
      dispatch({type: "SHOW_CHAT", payload: false})
    }
  }, [page, dispatch])



  return (authIsReady &&
    <div className={styles.Dashboard}>
      <div className={hideMenu? `${styles.hideMenu} ${styles.side}` : styles.side}>
        <SideNav user={user}/>
      </div>
      <div className={styles.main}>
        {(page === undefined || page === "home") && <Projects all={true}/>}
        {(page === "newProject") && <ProjectForm document={document} error={error} isPending={isPending} user={user}/>}
        {(page === "profile") && <Profile user={user}/>}
        {(page === "favourite") && <Favourite user={user}/>}
      </div>
      <div className={showChat? `${styles.showChat} ${styles.side2}` : styles.side2}>
        <Users />
      </div>
    </div>
  )
}