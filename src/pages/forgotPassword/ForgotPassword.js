import styles from "./ForgotPassword.module.css"
import Nav from '../../components/nav/Nav'
import { Link } from "react-router-dom"
import { useState } from "react"
import useResetPassword from "../../hooks/useResetPassword"
import { PulseLoader } from "react-spinners"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const { errorMessage, resetMessage, resetPassword, isPending } = useResetPassword()


  const handleSubmit = (e) => {
    e.preventDefault()

    resetPassword(email)
  }

  return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit}>
          <h1>Enter Your Email</h1>
          {(errorMessage && !resetMessage) && <div className="small-error">{errorMessage}</div>}
          {(!errorMessage && resetMessage) && <div style={{color: "#44AFAF", paddingBottom: "5px"}}>{resetMessage}</div>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
          {!isPending && <button type="submit" className={styles.submit}>Reset</button>}
          {isPending && <button type="submit" className={styles.submit} disabled>
            <PulseLoader size={10} color="#000000b1" />
          </button>
          }
          <Link to='/login'>Back to Login</Link>
        </form>
      </div>
    </div>
  )
}
