import { Outlet } from "react-router-dom"
import { Navbar, NavbarAdm } from "./Navbar"
import { Sidebar, SidebarAdm } from "./Sidebar"

export const Template = () => {
  return (
    <div className="bg-[#070707] flex h-screen w-screen">
      <Sidebar/>
      <div className="flex flex-col w-screen overflow-auto">
        <Navbar/>
        <div className="h-[92.5vh] overflow-auto">
          <Outlet/>  
        </div>
      </div>
    </div>
  )
}


export const TemplateAdm = () => {
  return (
    <div className="bg-slate-950 flex h-screen w-screen">
      <SidebarAdm/>
      <div className="flex flex-col w-screen overflow-auto">
        <NavbarAdm/>
        <div className="h-[92.5vh] overflow-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}