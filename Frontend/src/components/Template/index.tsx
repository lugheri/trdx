import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { SidebarAdm } from "./SidebarAdm"
import { NavbarAdm } from "./NavbarAdm"
import useAuth from '../../hooks/useAuth';
import { Student } from '../../contexts/Dtos/auth.dto';
import api from '../../services/api';
import { LoadingBars } from '../Loading';



export const Template = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null
  const [ typeAccess, setTypeAccess ] = useState<null | 'community' | 'default'>(null)

  const checkTypeAccess = async () => {
    try{
      const type = await api.get(`checkTypeStudentAccess/${userData ? userData.id : 0}`)
      setTypeAccess(type.data.response['community'] == 1 ? 'community' : 'default')
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    checkTypeAccess()
  },[])

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
    userData === null ? 
    <LoadingBars/> : (
      <div className="h-screen w-screen overflow-x-hidden overflow-y-auto">
        <Sidebar typeAccess={typeAccess} userData={userData}/>
        <Navbar  typeAccess={typeAccess} userData={userData}/>
        <Outlet/>  
      </div>
    )
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

/*
export const TemplateOld = () => {
  return (
    <div className="bg-[#070707] flex h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col w-screen overflow-auto">
        <Navbar/>
        <Outlet/>  
      </div>
    </div>
  )
}*/

