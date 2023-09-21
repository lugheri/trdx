import useAuth from "../../../hooks/useAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";



export const NavbarAdm: React.FC<{side:'open'|'closed'}>  = (props) => {
  const authenticate = useAuth();

  return (
    <div className="flex justify-between items-center px-4 h-14 bg-gradient-to-l from-neutral-900 via-neutral-950 to-transparent">
      <div className={`${props.side == 'closed' && "ml-[150px]"} rounded-md overflow-hidden border border-slate-900 bg-slate-800 w-1/3 flex justify-start items-center`}>
        <FontAwesomeIcon className="px-2 text-slate-400 text-xs" icon={Fas.faSearch}/>
        <input className="bg-slate-800 w-full border-none text-sm py-1 hover:ring-0 hover:border-none" placeholder="Busque Módulos ou funções"/>
      </div>
      <div className="flex justify-center items-center">
        <div className="text-gray-400 border-r border-slate-500 dark:text-gray-300 opacity-50 text-xl py-3 px-4 hover:opacity-100 cursor-pointer ">
          <FontAwesomeIcon icon={Far.faBell}/>
        </div>
        <div className="group text-xl p-2 cursor-pointer flex justify-center items-center">
          <FontAwesomeIcon className="text-3xl px-1 opacity-50 text-blue-200" icon={Fas.faUserCircle}/>
          <div className="flex flex-col justify-center items-start">
            <p className="text-sm font-medium text-slate-300">{authenticate?.userData?.name}</p>
            <p className="text-xs font-thin text-blue-100">{authenticate?.userData?.mail}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
