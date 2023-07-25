import { Outlet } from "react-router-dom"
import { Navbar, NavbarAdm } from "./Navbar"
import { Sidebar, SidebarAdm } from "./Sidebar"

export const Template = () => {
  return (
    <div className="bg-blue-50 dark:bg-[#1e272e] flex h-screen w-screen">
      <Sidebar/>
      <div className="flex flex-col w-screen overflow-auto">
        <Navbar/>
        <div className="h-[100vh] overflow-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}


export const TemplateAdm = () => {
  return (
    <div className="bg-blue-50 dark:bg-[#232323]  flex h-screen w-screen">
      <SidebarAdm/>
      <div className="flex flex-col w-screen overflow-auto">
        <NavbarAdm/>
        <div className="h-[100vh] overflow-auto">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}