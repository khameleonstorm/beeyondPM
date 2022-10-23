import { HiOutlineLogout } from 'react-icons/hi'
import { useLogout } from '../../hooks/useLogout'
import Projects from '../projects/Projects'
import styles from './Profile.module.css'

export default function Profile({user}) {
  const { logout } = useLogout()


  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.cover}>
          <h2>{user.displayName.substring(0, 10)}</h2>
          <img className={styles.img} src={`https://robohash.org/${user.uid}`} alt="avatar"/>
          <img className={styles.avatar} src={user.photoURL} alt="avatar"/>
        </div>
      </div>
      <Projects all={false}/>

      <div className={styles.logout} onClick={logout}>
        <HiOutlineLogout className={styles.logoutBTN}/>
      </div>
    </div>
  )
}
