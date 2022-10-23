import styles from "./SignUp.module.css"
import Nav from '../../components/nav/Nav'
import { Link } from "react-router-dom"
import { useState } from "react"
import { useSignup } from "../../hooks/useSignup"
import { PulseLoader } from "react-spinners"

export default function SignUp() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [imgError, setImgError] = useState(null)
  const [image, setImage] = useState(null)
  const { error, isPending, signUp } = useSignup()


  // handle image input field
  const handleImage = (e) => {
    setImgError(null)
    console.log(e.target.files)
    if (!e.target.files[0]) {
      setImgError("File can't be empty")
      setTimeout(() => {
        setImgError(null)
      }, 3000)
      return
    }
    if (e.target.files[0].size > 5000000) {
      setImgError("File size is too large")
      setTimeout(() => {
        setImgError(null)
      }, 3000)
      return
    }

    setImage(e.target.files[0])
    setImgError(null)
  }


  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!error && !imgError) {
      signUp(email, password, displayName, image)
      console.log(email, password, displayName, image)
    }
  }


  return (
    <div className={styles.signup}>
      <Nav />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          {error && <div className="small-error">{error}</div>}
          <input type="text" placeholder="Username" value={displayName} maxLength={15} onChange={e => setDisplayName(e.target.value)} required/>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
          <input className='custom-file-input' type="file" accept="image/png, image/jpg, image/gif, image/jpeg"
          required
          onChange={handleImage}
           />
          {imgError && <p className={styles.imgError}>{imgError}</p>}
          {!isPending && <button type="submit" className={styles.submit}>Sign Up</button>}
          {isPending && <button type="submit" className={styles.submit} disabled>
            <PulseLoader size={10} color="#000000b1" />
          </button>
          }
          <p>Already have an account? <Link to='/Login'>Login</Link></p>
        </form>
      </div>
    </div>
  )
}
