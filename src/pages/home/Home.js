import React, { useEffect } from 'react'
import Nav from '../../components/nav/Nav'
import styles from "./Home.module.css"
import { Link, useNavigate } from "react-router-dom"
import useAuth from '../../hooks/useAuth'
import phoneChat from "../../assets/phoneChat.svg"

export default function Home() {
  const { user, authIsReady } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/dashboard")
    }
  }, [user, navigate])


  return ((authIsReady && !user) &&
    <div className={styles.Home}>
      <Nav />
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1>BEE<span>Y</span>OND</h1>
          <h1><span>P</span>ROJECT</h1>
          <h1 className={styles.management}>MANA<span>G</span>EMEN<span>T</span></h1> <br />
          <Link to="/sign-up">
            <button className={styles.start}>
              Start Now
            </button>
          </Link>
        </div>

        <div className={styles.illustration}>
          <img src={phoneChat} alt="phoneChat" />
        </div>
      </div>
    </div>
    )
}
