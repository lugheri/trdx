import { ToggleDarkMode } from "../../components/Buttons"

export const Profile = () => {
  return(
    <div>
      <h1>Profile</h1>
      <div className="w-full flex justify-center border-b border-slate-300 hover:bg-slate-200
                             dark:border-slate-700 dark:hover:bg-slate-800">
                <ToggleDarkMode/>            
              </div> 
    </div>
  )
}