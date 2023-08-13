import useAuth from "../../../hooks/useAuth";
import api from "../../../services/api";
import { ToggleDarkMode } from "../../Buttons"
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink, useLocation} from 'react-router-dom';
import { NavLinkProps, itemSide } from "../../Dtos/sidebar.dto";
import { InputForm } from "../../Inputs";

export const Navbar = () => {
  return (
    <>
      <div className=" text-neutral-900  dark:text-white flex justify-between items-center px-4 h-14">
        {/*TITLE*/}
        <div className="bg-slate-400 dark:bg-stone-900 w-1/3 h-[35px] flex justify-between items-center overflow-hidden border rounded-full border-slate-500">
          <FontAwesomeIcon className="p-3 text-xs text-slate-300" icon={Fas.faSearch}/>
          <input type="text" className="flex-1 px-2 border-0 bg-slate-400 dark:bg-stone-900 dark:text-slate-400 h-full focus:ring-0" placeholder="Pesquise cursos e aulas ..."/>
        </div>

        {/*ACTIONS*/}
        <div className="flex justify-center items-center">
          <div className="text-gray-900 dark:text-gray-300 opacity-50 text-xl p-2 hover:opacity-100 cursor-pointer mx-2">
            <FontAwesomeIcon icon={Far.faBell}/>
          </div>
          
          <div className="group opacity-50 text-xl p-2 hover:opacity-100 cursor-pointer mx-2 flex justify-center items-center">
            <FontAwesomeIcon className="text-gray-900 dark:text-gray-300 block group-hover:hidden" icon={Fas.faDoorClosed}/>
            <FontAwesomeIcon className="text-red-800 dark:text-gray-300 hidden group-hover:block" icon={Fas.faDoorOpen}/>
            <p className="mx-2 text-sm group-hover:text-red-500">Sair</p>
          </div>
          {/*PROFILE*/}
          
          
        </div>  
      </div>
      
    </>
  )
}


export const NavbarAdm = () => {
  const authenticate = useAuth();
  const location = useLocation();
  const moduleName = location.pathname.split('/')[2]; 
  const [ userLevel, setUserLevel ] = useState<number>(0)

  const [ retry, setRetry ] = useState<number>(0)
  const [ menu, setMenu ] = useState<itemSide[]>([])  

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
    if(moduleName){
      getSubmodules()
    }
  },[retry,location])


  return (
    <>
      <div className="bg-white text-neutral-900 dark:bg-slate-700 dark:text-white flex justify-between items-center px-4 h-14">
        {/*TITLE*/}
        <div className="bg-slate-400 dark:bg-stone-900 w-1/3 h-[35px] flex justify-between items-center overflow-hidden border rounded-full border-slate-500">
          <FontAwesomeIcon className="p-3 text-xs text-slate-300" icon={Fas.faSearch}/>
          <input 
            className="flex-1 px-2 border-0 bg-slate-400 dark:bg-stone-900 dark:text-slate-400 h-full focus:ring-0"
            placeholder="Pesquise cursos e aulas ..."/>
        </div>
        {/*ACTIONS*/}
        <div className="flex justify-center items-center">
          <div className="text-gray-900 dark:text-gray-300 opacity-50 text-xl p-2 hover:opacity-100 cursor-pointer mx-2">
            <FontAwesomeIcon icon={Far.faBell}/>
          </div>
          {/*PROFILE*/}
          <a href="#" className="group relative">
            <div className="flex bg-slate-50 border-x border-slate-300 items-center min-w-[180px] h-full py-[.4rem] px-2 opacity-70
                           dark:bg-gray-900 dark:border-gray-700 hover:opacity-100">
              <div className="w-[40px] h-[40px] rounded-full text-4xl flex items-center justify-center text-teal-800">
                <FontAwesomeIcon icon={Fas.faCircleUser}/>
              </div>
              <div className="flex flex-col px-2">
                <p className="font-semibold text-slate-600 dark:text-slate-300">Nome Completo</p>
                <small>Cargo</small>
              </div>
            </div>
            <div 
              className="flex-col justify-center items-center absolute group-focus:flex hidden w-full px-2 bg-slate-50  shadow right-0 top-[56px] opacity-100 border-x border-slate-300
                      dark:bg-gray-900 dark:border-gray-700">
              <NavLink
                to="/admin"
                className="w-full flex justify-center p-4 border-b border-slate-300 hover:bg-slate-200
                           dark:border-slate-700 dark:hover:bg-slate-800">
                  <FontAwesomeIcon className="mr-2 opacity-60 " icon={Fas.faHeadset}/> 
                  Suporte
              </NavLink>   
              <div className="w-full flex justify-center border-b border-slate-300 hover:bg-slate-200
                             dark:border-slate-700 dark:hover:bg-slate-800">
                <ToggleDarkMode/>            
              </div> 
              <NavLink
                to="/admin"
                className="w-full flex justify-center p-4 hover:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800">
                  <FontAwesomeIcon className="mr-2 opacity-60 " icon={Fas.faArrowRightFromBracket}/> 
                  Sair
              </NavLink> 
            </div>           
          </a>
          
          
        </div>  
      </div>
      <div className="flex px-4 bg-slate-50 text-neutral-900 shadow-md min-h-[6px] 
                    dark:bg-slate-700 opacity-80 hover:opacity-90 dark:text-white ">
        { menu.length > 0 ? 
          menu.map((item:itemSide, index: number)=>(
            <NavItem
              key={index} 
               to={`/admin/${moduleName}/${item.name}`}
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
  const nav = "flex px-2 py-1 hover:bg-slate-100 dark:hover:bg-neutral-900 mx-1 justify-center items-center font-semibold text-sm opacity-60 hover:opacity-100 ease-in duration-150"
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