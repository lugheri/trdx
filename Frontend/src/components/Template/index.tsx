import { useState } from 'react';
import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { SidebarAdm } from "./SidebarAdm"
import { NavbarAdm } from "./NavbarAdm"



export const Template = () => {
  /*Sizes responsives 
   - : Mobile
   - sm: Tables
   - md: Tablets and Little Monitors
   - lg: Desktop
   - xl: Desktop
   - 2xl: Tv and Big Monitors
  
   Classes responsives using in this projetc
   -   : Mobile
   - md: Tablets and Little Monitors  
   - lg: Desktop
   - 2xl: Tv and Big Monitors
  */
  return(
    <div className="
      h-screen w-screen overflow-x-hidden overflow-y-auto
      ">
      <Sidebar/>
      <Outlet/>  
    </div>
  )
}

export const TemplateAdm = () => {
  const [ side, setSide ] = useState<'open'|'closed'>('open')
  return (
    <div className="bg-[#070707] flex h-screen w-screen">
      <SidebarAdm side={side} setSide={setSide}/>
      <div className="flex flex-col w-screen overflow-auto">
        <NavbarAdm side={side}/>
        <div className="h-[92.5vh] overflow-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}


export const TemplateOld = () => {
  return (
    <div className="bg-[#070707] flex h-screen w-screen">
      <Sidebar/>
      <div className="flex flex-col w-screen overflow-auto">
        <Navbar/>
        <Outlet/>  
      </div>
    </div>
  )
}

