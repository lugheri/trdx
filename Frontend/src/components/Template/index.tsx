import { Outlet } from "react-router-dom"

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
    <div className="bg-white dark:bg-slate-800">
      <h1>Template Adm</h1>
      <Outlet/>
    </div>
  )
}