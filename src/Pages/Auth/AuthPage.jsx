import './AuthPage.css'
import { Register } from "../../components/Register.jsx"
import { Login } from '../../components/Login.jsx'
import { useState } from 'react'

export const AuthPage = () => {
  const [islogin, setIsLogin] = useState(false)
  const handleAuthPage = () => {
    setIsLogin((prev) => !prev)
  }
  return (
    <div className='auth-container'>
      {
        islogin ? (
          <Login/>
        ) : (
          < Register switchAuthHandler={handleAuthPage}/>
        )
      }
    </div>
  )
}

