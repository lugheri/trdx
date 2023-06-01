import { Outlet } from "react-router-dom"
import { NavbarAdm } from "./Navbar"
import { SidebarAdm } from "./Sidebar"

export const Template = () => {
  return (
    <div className="bg-white dark:bg-slate-800">
      <h1>Template</h1>
      <Outlet/>
    </div>
  )
}


export const TemplateAdm = () => {
  return (
    <div className="bg-green-50 dark:bg-zinc-950 flex h-screen w-screen">
      <SidebarAdm/>
      <div className="flex flex-col w-screen">
        <NavbarAdm/>
        <div>
          <h1>Template Adm</h1>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}