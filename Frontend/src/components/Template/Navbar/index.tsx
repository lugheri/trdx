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
    console.log("change theme")
    themeProps === undefined ? false
    : themeProps.theme === "light" || undefined  ? themeProps.setTheme("dark") : themeProps.setTheme("light");
  }
  return (
    <div>
      <h1>NavbarAdm</h1>
      { themeProps ? (<Button onClick={()=>changeTheme()} name="Theme" />) : false }
    </div>
  )
}