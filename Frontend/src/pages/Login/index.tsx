import { useState, useEffect } from "react";
import { Toggle } from "../../components/Buttons"

export const Login = () => {
  return (
    <div>
      <h1>Login</h1>
     <form>
      <label className="block">
        <span className="block text-sm font-medium text-slate-700">Username</span>
        <input type="email" className="peer"/>
        <p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">Username invalid!</p>
      </label>
     </form>
     
    </div>
  )
}

export const LoginAdm = () => {
  const [ darkMode, setDarkMode ] = useState<boolean>(localStorage.getItem('theme') == 'dark' ? true : false) 
  useEffect(()=>{
    darkMode ? localStorage.setItem('theme','dark') : localStorage.setItem('theme','light')
  },[darkMode])

  return (
    <div className={ darkMode ? 'dark' : 'light'}>
      <div className="bg-white dark:bg-slate-800">
        <h1>Login Adm {localStorage.getItem('theme')}</h1>
        
        <Toggle value={darkMode} setValue={setDarkMode}/>


      </div>
    </div>
  )
}