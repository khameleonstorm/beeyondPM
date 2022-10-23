import styles from "./Login.module.css"
import Nav from '../../components/nav/Nav'
import { Link } from "react-router-dom"
import { useState } from "react"
import { useLogin } from "../../hooks/useLogin"
import { PulseLoader } from "react-spinners"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { error, isPending, login } = useLogin()


  const handleSubmit = (e) => {
    e.preventDefault()

    if(!error) {
      console.log(email, password)
      login(email, password)
    }
  }
  


  return (
    <div className={styles.Login}>
      <Nav />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <h1>Welcome Back Yo!!!</h1>
          {error && <div className="small-error">{error}</div>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
          {!isPending && <button type="submit" className={styles.submit}>Sign in</button>}
          {isPending && <button type="submit" className={styles.submit} disabled>
            <PulseLoader size={10} color="#000000b1" />
          </button>
          }
          <Link to='/forgot-password'>forgot Password?</Link>
          <p>If you don't have an account? <Link to='/sign-up'>Sign Up</Link></p>
        </form>
      </div>
    </div>
  )
}
