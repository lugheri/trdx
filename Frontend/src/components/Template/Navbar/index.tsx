import useTheme from "../../../hooks/useTheme"
import { Button } from "../../Buttons"

export const Navbar = () => {
  return (
    <div>
      <h1>NavBar</h1>
    </div>
  )
}

export const NavbarAdm = () => {
  const themeProps = useTheme() 
  const changeTheme = () => {
    themeProps === undefined ? false
    : themeProps.theme === "dark" ? themeProps.setTheme("light") : themeProps.setTheme("dark");
  }
  return (
    <div className="bg-white text-neutral-900 shadow-md dark:bg-zinc-950 dark:text-white flex justify-between items-center px-4 h-16">
      {/*TITLE*/}
      <div>
        Navbar Adm
      </div>
       {/*ACTIONS*/}
       <div>
       { themeProps ? (<Button onClick={()=>changeTheme()} name="Theme" />) : false }
       </div>
  
    </div>
  )
}