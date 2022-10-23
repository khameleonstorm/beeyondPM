import Projects from '../projects/Projects'
import styles from './Favourite.module.css'

export default function Favourite() {
  return (
    <div className={styles.container}>
      <Projects all={true} favourite={true}/>
    </div>
  )
}
