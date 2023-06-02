import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink } from 'react-router-dom';
import { NavLinkProps, itemSide } from '../../Dtos/sidebar.dto';
import api from '../../../services/api';

export const Sidebar = () => {
  return (
    <div>
      <h1>SideBar</h1>
    </div>
  )
}

export const SidebarAdm = () => {
  const [ menu, setMenu ] = useState<itemSide[]>([])

  const getMenu = async() => {
    try{
      const type='side'
      const parentModule=0
      const levelId=100
      const menuItems = await api.get(`modules/${type}/${parentModule}/${levelId}`)
      setMenu(menuItems.data.response)
    }catch(e){
      console.log(e)
    }
  }
  useEffect(()=>{
    getMenu()
  },[])


  const [ side, setSide ] = useState<'open'|'closed'>('open')
  const [ sideSize, setSideSize ] = useState<'w-60'|'w-20'>('w-60')
  useEffect(()=>{
    side == 'open' ? setSideSize('w-60') : setSideSize('w-20')    
  },[side])

  return (
    <div className={`bg-cyan-950 dark:bg-gray-900 flex flex-col ${sideSize} ease-in duration-150`}>
      {/*BRAND*/}
      <div className="bg-sky-950 dark:bg-gray-900 h-16 flex justify-center items-center text-cyan-100 font-bold relative">
        BRAND
        { side == 'open' ? (
          <div className="absolute -right-2 -bottom-3 dark:bg-cyan-950 dark:text-cyan-50 dark:hover:bg-cyan-800 bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-950 rounded-full w-6 text-cyan-950 h-6 flex justify-center items-center text-xs shadow-md cursor-pointer" 
               onClick={()=>setSide('closed')}>
            <FontAwesomeIcon icon={Fas.faCaretLeft}/>
          </div>
        ) : (
          <div className="absolute -right-2 -bottom-3 dark:bg-cyan-950 dark:text-cyan-50 dark:hover:bg-cyan-800 bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-950 rounded-full w-6 text-cyan-950 h-6 flex justify-center items-center text-xs shadow-md cursor-pointer" 
               onClick={()=>setSide('open')}>
          <FontAwesomeIcon icon={Fas.faCaretRight}/>
        </div>
        )}        
      </div>
      {/*SIDE*/}
      <div className="flex-1">
        <ul className="py-2">
          { menu.length == 0 ? (<p>Carregando...</p>)
          : menu.map((item:itemSide, index: number)=>(
            <SideItem key={index}
                      to={`/admin/${item.name}`} 
                      side={side} 
                      name={ item.alias ? item.alias : '' } 
                      icon={ item.icon ? item.icon : null}/>  
          ))}
        </ul>
      </div>
      {/*FOOTER*/}
      <div className="p-4">
        footer
      </div>
    </div>
  )
}

const SideItem : React.FC<NavLinkProps> = (props) => {
  const nav="flex w-full justify-start items-center text-sm font-semibold text-white p-2 mt-1 opacity-70"
  const activeNav="border-r-green-600 border-r-8 opacity-100 "

  const navClosed="flex flex-col w-full justify-center items-center text font-semibold text-white p-2 mb-1 opacity-70"
  const activeNavClosed="border-r-green-600 border-r-8 opacity-100"
  
  return(
    props.side == 'open' ? (
      <NavLink
        to={props.to}
        className={({ isActive, isPending }) =>isActive ? (`${nav} ${activeNav}`) : isPending ? nav : nav}>
        {props.icon ? (<FontAwesomeIcon className="px-4 ml-3 opacity-60" icon={Fas[props.icon] as IconProp}/>) : false}
        {props.name ? (<p>{props.name}</p>) : false}      
      </NavLink>
    ):(
      <NavLink
        className={({ isActive, isPending }) =>isActive ? (`${navClosed} ${activeNavClosed}`) : isPending ? navClosed : navClosed}
        to={props.to}>
        {props.icon ? (<FontAwesomeIcon className="py-1" icon={Fas[props.icon] as IconProp}/>) : false}  
        {props.name ? (<p className="text-xs font-light">{props.name}</p>) : false}         
      </NavLink>
    )
  )
}