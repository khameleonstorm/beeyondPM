import logo from "../../assets/pm_logo.svg"
import { Link } from "react-router-dom"
import styles from "./Nav.module.css"

export default function Nav() {
  return (
    <>
      <nav className={styles.container}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </nav>
    </>
  )
}
