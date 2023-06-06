import useAuth from "../../../hooks/useAuth";
import useTheme from "../../../hooks/useTheme"
import api from "../../../services/api";
import { Button } from "../../Buttons"
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink, useLocation} from 'react-router-dom';
import { NavLinkProps, itemSide } from "../../Dtos/sidebar.dto";

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
        <a href="#" className="flex group justify-center items-center">
          <div className="text-gray-900 dark:text-gray-300 opacity-50 text-xl p-2 hover:opacity-100 cursor-pointer mx-2">
            <FontAwesomeIcon icon={Far.faBell}/>
          </div>
          <div className="flex items-center relative min-w-[180px] px-2 group">
            <div className="w-[40px] h-[40px] rounded-full text-4xl flex items-center justify-center text-teal-800  opacity-80 group-hover:opacity-100">
              <FontAwesomeIcon icon={Fas.faCircleUser}/>
            </div>
            <div className="flex flex-col px-2 opacity-80 group-hover:opacity-100">
              <p className="font-semibold text-slate-600 dark:text-slate-400">Nome Completo</p>
              <small>Cargo</small>
            </div>
            <div className="absolute group-focus:inline hidden w-full bg-white dark:bg-gray-900 p-4 right-0 top-14 opacity-100">
              { themeProps ? (<Button onClick={()=>changeTheme()} name="Theme" />) : false }
            </div>
            
          </div>
          
          
        </a>  
      </div>
      <div className="bg-white text-neutral-900 shadow-md min-h-[6px] dark:bg-zinc-950 dark:text-white flex px-4">
        { menu.length > 0 ? 
          menu.map((item:itemSide, index: number)=>(
            <NavItem
              key={index} 
               to={`/admin/settings/${item.name}`}
             side='open'
             name={ item.alias ? item.alias : '' }
             icon={ item.icon ? item.icon : null}/>
          ))
        : false }
      </div>
    </>
  )
}

const NavItem : React.FC<NavLinkProps>  = (props) => {
  const nav = "flex px-2 py-1 hover:bg-slate-100 dark:hover:bg-green-950 mx-1 justify-center items-center font-semibold text-sm opacity-60 hover:opacity-100 ease-in duration-150"
  const navActive = "flex px-2 py-1 mx-2 justify-center items-center font-semibold text-sm border-b-4  border-b-green-600 dark:border-b-green-300 border-b-4 opacity-100"
  return(
    <NavLink
      to={props.to}
      className={({ isActive, isPending }) =>isActive ? navActive : isPending ? nav : nav}>
      {props.icon ? (<FontAwesomeIcon className="mr-2 opacity-60 " icon={Fas[props.icon] as IconProp}/>) : false}
      {props.name ? (<p>{props.name}</p>) : false}      
    </NavLink>
  )
}