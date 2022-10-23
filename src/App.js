import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages routes
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import SignUp from './pages/signUp/SignUp';
import ForgotPassword from './pages/forgotPassword/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectDetails from './components/projectDetails/ProjectDetails';

function App() {


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/dashboard/' element={<Dashboard />} />
          <Route path='/dashboard/:page' element={<Dashboard />} />
          <Route path='/dashboard/project/:id' element={<ProjectDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
