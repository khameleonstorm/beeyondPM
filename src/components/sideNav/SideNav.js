import styles from './SideNav.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import IMG from "../../assets/profile-logo.gif"
import { useLogout } from '../../hooks/useLogout'
import { HiHome, HiOutlineHome, HiOutlineLogout, HiOutlineViewGridAdd, HiViewGridAdd } from "react-icons/hi";
import { RiAccountPinBoxLine, RiAccountPinBoxFill } from 'react-icons/ri'
import { RiChatSmile2Line, RiChatSmile2Fill } from 'react-icons/ri'
import { BsMoonStars, BsMoonStarsFill } from 'react-icons/bs'
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';

export default function SideNav({user}) {
  const { page } = useParams()
  const { logout } = useLogout()
  const navigate = useNavigate()
  const { dispatch } = useAuth()


  const showChat = () => {
    navigate("/dashboard/chat")
    dispatch({type: "SHOW_CHAT", payload: true})
  }

  
  useEffect(() => {
    if(page !== "chat"){
      dispatch({type: "SHOW_CHAT", payload: false})
    }
  }, [page, dispatch])
  

  return (
    <div className={styles.container}>
        <div className={styles.profile}>
            <img src={user.photoURL ? user.photoURL :IMG} alt="avatar"/>
        </div>
        <div className={styles.links}>
          {page === undefined || page === "home" ? 
          <div className={styles.active}>
            <HiOutlineHome onClick={() => navigate("/dashboard/home")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/home")}>Dashboard</p>
          </div> :
          <div>
            <HiHome onClick={() => navigate("/dashboard/home")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/home")}>Dashboard</p>
          </div>
          }

          {(page === "newProject") ?
          <div className={styles.active}>
            <HiOutlineViewGridAdd onClick={() => navigate("/dashboard/newProject")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/newProject")}>New Project</p>
          </div> :
          <div>
            <HiViewGridAdd onClick={() => navigate("/dashboard/newProject")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/newProject")}>New Project</p>
          </div>
          }

          {(page === "profile") ?
          <div className={styles.active}>
            <RiAccountPinBoxLine onClick={() => navigate("/dashboard/profile")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/profile")}>Profile</p>
          </div> :
          <div>
            <RiAccountPinBoxFill onClick={() => navigate("/dashboard/profile")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/profile")}>Profile</p>
          </div>
          }

          {(page === "favourite") ?
          <div className={styles.active}>
            <BsMoonStars onClick={() => navigate("/dashboard/favourite")} className={styles.menuIcon}/> 
            <p onClick={() => navigate("/dashboard/favourite")}>Favourite</p>
          </div> :
          <div>
            <BsMoonStarsFill onClick={() => navigate("/dashboard/favourite")} className={styles.menuIcon}/>
            <p onClick={() => navigate("/dashboard/favourite")}>Favourite</p>
          </div>
          }

          {(page === "chat") ? 
          <div className={`${styles.active} ${styles.chatLink}`}>
            <RiChatSmile2Line onClick={showChat} className={styles.menuIcon}/>
          </div> :
          <div className={styles.chatLink}>
            <RiChatSmile2Fill onClick={showChat} className={styles.menuIcon}/>
          </div>
          }
        </div>
        <div className={styles.exit} onClick={logout}>
          <HiOutlineLogout className={styles.logout} style={{marginLeft: "1rem"}}/>
          <p>LogOut</p>
        </div>
    </div>
  )
}
