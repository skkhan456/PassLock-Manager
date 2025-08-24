import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'

import Home from "./pages/home.jsx"
import Login from "./pages/login.jsx"
import Signup from "./pages/Signup.jsx"
import { Routes, Route, Navigate } from "react-router-dom";
import Refreshhandler from './Refreshhandler.jsx';

function App() {
  const [isAuthenticate,setisAuthenticate]=useState(false);

  const PrivateRoute=({element})=>{
    return (isAuthenticate)?element:<Navigate to="/login"/>
  }

  return (
    <>
      

      <div className="app">
      <Refreshhandler setisAuthenticate={setisAuthenticate} />
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      {/* <Route path="/" element={<Login />} /> */}
      <Route path="/home" element={<PrivateRoute element={<Home/>} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </div>
    </>
  )
}

export default App