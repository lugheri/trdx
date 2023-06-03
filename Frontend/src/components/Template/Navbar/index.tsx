import useAuth from "../../../hooks/useAuth";
import useTheme from "../../../hooks/useTheme"
import api from "../../../services/api";
import { Button } from "../../Buttons"
import { useState, useEffect } from 'react';

import { useLocation} from 'react-router-dom';
import { itemSide } from "../../Dtos/sidebar.dto";

export const Navbar = () => {
  return (
    <div>
      <h1>NavBar</h1>
    </div>
  )
}


export const NavbarAdm = () => {
  const authenticate = useAuth();  
  const themeProps = useTheme() 
  const location = useLocation();
  const moduleName = location.pathname.split('/')[2]; 
  const [ userLevel, setUserLevel ] = useState<number>(0)

  const [ retry, setRetry ] = useState<number>(0)
  const [ menu, setMenu ] = useState<itemSide[]>([])

  const changeTheme = () => {
    themeProps === undefined ? false
    : themeProps.theme === "dark" ? themeProps.setTheme("light") : themeProps.setTheme("dark");
  }

  const getSubmodules = async() => {
    if(authenticate !== undefined ){ 
      setUserLevel(authenticate.levelAccess) 
    }
    if(userLevel==0){
      if(retry<=1000){
        const tent = retry+1
        setTimeout(() => {
          setRetry(tent)
        },1000)
      }
    }
    try{
      const type='side'
      const menuItems = await api.get(`subModules/${type}/${moduleName}/${userLevel}`)
      setMenu(menuItems.data.response)     
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    console.log('retry',retry)
    getSubmodules()
  },[retry,location])


  return (
    <>
      <div className="bg-white text-neutral-900 dark:bg-zinc-950 dark:text-white flex justify-between items-center px-4 h-14">
        {/*TITLE*/}
        <div>
          Navbar Adm
        </div>
        {/*ACTIONS*/}
        <div>
        { themeProps ? (<Button onClick={()=>changeTheme()} name="Theme" />) : false }
        </div>  
      </div>
      <div className="bg-white text-neutral-900 shadow-md min-h-[6px] dark:bg-zinc-950 dark:text-white flex px-4">
        { menu.length > 0 ? 
          menu.map((item:itemSide, index: number)=>(
            <p key={index}>{item.alias}</p>
          ))
        : false }
      </div>
    </>
  )
}