import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink } from 'react-router-dom';
import { NavLinkProps, itemSide } from '../../Dtos/sidebar.dto';
import api from '../../../services/api';
import Logo from '/img/logo.png'
import Brand from '/img/brand.png'
import useAuth from '../../../hooks/useAuth';


export const Sidebar = () => {
  return (
    <div>
      <h1>SideBar</h1>
    </div>
  )
}

export const SidebarAdm = () => {
  const authenticate = useAuth();  
  const [ version, setVersion ] = useState<string>('Alpha Centauri: 1.0.0')
  const [ userLevel, setUserLevel ] = useState<number>(0)
  const [ retry, setRetry ] = useState<number>(0)
  const [ menu, setMenu ] = useState<itemSide[]>([])
  const [ menuSettings, setMenuSettings ] = useState<itemSide[]>([])

  

  const getMenu = async() => {
    if(authenticate !== undefined ){ 
      setUserLevel(authenticate.levelAccess) 
    }
    if(userLevel==0){
      if(retry<=10){
        const tent = retry+1
        setRetry(tent)
      }
    }
    try{
      const type='side'
      const parentModule=0
      const menuItems = await api.get(`modules/${type}/${parentModule}/${userLevel}`)
      setMenu(menuItems.data.response)
      const typeSettings='set'  
      const menuSetItems = await api.get(`modules/${typeSettings}/${parentModule}/${userLevel}`)
      setMenuSettings(menuSetItems.data.response)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    setTimeout(()=>{
      getMenu()
    },500)
    
  },[retry])


  const [ side, setSide ] = useState<'open'|'closed'>('open')
  const [ sideSize, setSideSize ] = useState<'w-60'|'w-20'>('w-60')
  useEffect(()=>{
    side == 'open' ? setSideSize('w-60') : setSideSize('w-20')    
  },[side])

  return (
    <div className={`bg-cyan-950 dark:bg-gray-900 flex flex-col ${sideSize} ease-in duration-150`}>
      {/*BRAND*/}
      <div className="bg-sky-950 dark:bg-gray-900 h-16 flex justify-center items-center text-cyan-100 font-bold relative">
        {side == 'open' ? (
          <>
            <img src={Logo} className="w-1/2 my-2"/>
            <div className="absolute -right-2 -bottom-3 dark:bg-cyan-950 dark:text-cyan-50 dark:hover:bg-cyan-800 bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-950 rounded-full w-6 text-cyan-950 h-6 flex justify-center items-center text-xs shadow-md cursor-pointer" 
                 onClick={()=>setSide('closed')}>
              <FontAwesomeIcon icon={Fas.faCaretLeft}/>
            </div>
          </>
        ) : (
          <>
            <img src={Brand} className="w-1/3 my-2"/>
            <div className="absolute -right-2 -bottom-3 dark:bg-cyan-950 dark:text-cyan-50 dark:hover:bg-cyan-800 bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-950 rounded-full w-6 text-cyan-950 h-6 flex justify-center items-center text-xs shadow-md cursor-pointer" 
                 onClick={()=>setSide('open')}>
              <FontAwesomeIcon icon={Fas.faCaretRight}/>
            </div>
          </>
        )}        
      </div>
      {/*SIDE*/}
      <div className="flex-1 flex flex-col justify-between">
        <ul className="py-2">
          { menu.length == 0 ? (<p>Carregando...</p>)
          : menu.map((item:itemSide, index: number)=>(
            <SideItem 
               key={index}
                to={`/admin/${item.name}`} 
              side={side} 
              name={ item.alias ? item.alias : '' } 
              icon={ item.icon ? item.icon : null}/>  
          ))}
        </ul>

        {/*Side Settings*/}
        <ul className="py-2">
          { menuSettings.length == 0 ? false
          : menuSettings.map((item:itemSide, index: number)=>(
            <SideItem 
               key={index}
                to={`/admin/${item.name}`} 
              side={side} 
              name={ item.alias ? item.alias : '' } 
              icon={ item.icon ? item.icon : null}/>  
          ))}
        </ul>

      </div>
      {/*FOOTER*/}
      <div className="text-center text-cyan-700 dark:text-gray-600 py-2 px-1 text-xs">
        Version: {version} - {userLevel}
      </div>
    </div>
  )
}

const SideItem : React.FC<NavLinkProps> = (props) => {
  const navDefault = "flex w-full justify-start items-center text-sm font-semibold text-white p-2 mt-1 opacity-50 hover:opacity-100 ease-in duration-150"
  const navActive = "flex w-full justify-start items-center text-sm font-semibold text-white p-2 mt-1 border-r-green-600 border-r-8 opacity-100"

  const navDefaultClosed = "flex flex-col group   w-full justify-center items-center text font-semibold text-white p-2 mb-1 opacity-70 hover:opacity-100 ease-in duration-150"
  const navActiveClosed = "flex flex-col group   w-full justify-center items-center text font-semibold text-white p-2 mb-1 border-r-green-600 border-r-8 opacity-100"
 
  return(
    props.side == 'open' ? (
      <NavLink
        to={props.to}
        className={({ isActive, isPending }) =>isActive ? navActive : isPending ? navDefault : navDefault}>
        {props.icon ? (<FontAwesomeIcon className="px-4 ml-3 opacity-60" icon={Fas[props.icon] as IconProp}/>) : false}
        {props.name ? (<p>{props.name}</p>) : false}      
      </NavLink>
    ):(
      <NavLink
        className={({ isActive, isPending }) =>isActive ? navActiveClosed : isPending ? navDefaultClosed : navDefaultClosed}
        to={props.to}>
        {props.icon ? (<FontAwesomeIcon className="py-1" icon={Fas[props.icon] as IconProp}/>) : false}  
        {props.name ? (<p className="hidden group-hover:inline text-[.7rem] font-light transition duration-150 ease-out hover:ease-in">{props.name}</p>) : false}         
      </NavLink>
    )
  )
}