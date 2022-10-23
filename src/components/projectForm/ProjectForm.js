import styles from "./ProjectForm.module.css"
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Select from 'react-select';
import { useFirestore } from "../../hooks/useFirestore";
import { MoonLoader } from "react-spinners";
import useAuth from "../../hooks/useAuth";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";



const options = [
  { value: 'React.js', label: 'React.js' },
  { value: 'Next.js', label: 'Next.js' },
  { value: 'React Native', label: 'React Native' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Django', label: 'Django' },
  { value: 'WEB3', label: 'WEB3' },
  { value: 'UI/UX', label: 'UI/UX' },
  { value: 'Animation', label: 'Animation' },
]

export default function ProjectForm({ document, error, user }) {
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [team, setTeam] = useState([])
  const [users, setUsers] = useState([])
  const [formError, setFormError] = useState(null)
  const { addDocument, res } = useFirestore("projects")
  const createdAt = new Date().toLocaleString()
  const { dispatch } = useAuth()
  const navigate = useNavigate()


  const hideMenu = () => {
    dispatch({ type: "HIDE_MENU", payload: true })
  }

  const showMenu = () => {
    dispatch({ type: "HIDE_MENU", payload: false })
    navigate(-1)
  }

  useEffect(() => {
    if (document) {
      const allusers = document.map((user) => {
        return { value: user, label: user.displayName }
      })
      setUsers(allusers)
    }
  }, [document])


  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError(null)

    if (projectName === '' || projectDesc === '' || dueDate === '' || category.value === '') {
      setFormError("Please fill all the fields")
      setTimeout(() => {
        setFormError(null)
      }, 3000);
      return
    }

    if (team.length === 0) {
      setFormError("Please add atleast one team member")
      setTimeout(() => {
        setFormError(null)
      }, 3000);
      return
    }

    const createdBy = {
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL
    }

    const projectTeam = team.map((member) => {
      return {
        id: member.value.uid,
        displayName: member.value.displayName,
        photoURL: member.value.photoURL
      }
    })

    const project = {
      projectName,
      projectDesc,
      dueDate,
      category: category.value,
      createdBy,
      projectTeam,
      comments: [],
      createdAt,
      like: []
    }

    addDocument(project)

    setProjectName('')
    setProjectDesc('')
    setDueDate('')
    setCategory('')
    setTeam([])
    setFormError(null)
    dispatch({ type: "HIDE_MENU", payload: false })
  }

  return (!error &&
    <div className={styles.container}>
      <form className={styles.projectForm} onSubmit={handleSubmit}>
      <h3>Add a new Project</h3>
        <TextField
          fullWidth
          size="small"
          id="outlined-name"
          label="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className={styles.input}
          autoComplete="off"
          onFocus={hideMenu}
        />
        <TextField
          multiline
          fullWidth
          rows={3}
          id="outlined-multiline-static"
          label="Project Description"
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          className={styles.input}
          autoComplete="off"
          onFocus={hideMenu}
        />
        <TextField
          type="date"
          fullWidth
          size="small"
          id="outlined-name"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={styles.input}
          onFocus={hideMenu}
        />
        <Select 
          value={category}
          options={options}
          onChange={(e) => setCategory(e)}
          className={styles.input}
          onFocus={hideMenu}
        />
        <Select 
          isMulti
          value={team}
          options={users}
          onChange={(e) => setTeam(e)}
          className={styles.input}
          placeholder="Assign Users"
          onFocus={hideMenu}
        />
        {formError && <p className={styles.error}>{formError}</p>}
        {res.isPending ? 
        <div className={styles.button}><MoonLoader size={10} color="#000000" className={styles.spinner}/></div> : 
        res.success ? <button>Done</button> : <button>Submit</button>
        }
      </form>
      <MdKeyboardBackspace className={styles.back} onClick={showMenu}/>
    </div>
  )
}
