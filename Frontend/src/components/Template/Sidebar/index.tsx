import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

import { Button } from '../../Buttons';
export const Sidebar = () => {
  return (
    <div>
      <h1>SideBar</h1>
    </div>
  )
}

export const SidebarAdm = () => {
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
            <FontAwesomeIcon icon={Fas.faCaretRight}/>
          </div>
        ) : (
          <div className="absolute -right-2 -bottom-3 dark:bg-cyan-950 dark:text-cyan-50 dark:hover:bg-cyan-800 bg-cyan-100 hover:bg-cyan-200 border-2 border-cyan-950 rounded-full w-6 text-cyan-950 h-6 flex justify-center items-center text-xs shadow-md cursor-pointer" 
               onClick={()=>setSide('open')}>
          <FontAwesomeIcon icon={Fas.faCaretLeft}/>
        </div>
        )}        
      </div>
      {/*SIDE*/}
      <div className="flex-1">
        actions
      </div>
      {/*FOOTER*/}
      <div className="p-4">
        footer
      </div>
      

    </div>
  )
}