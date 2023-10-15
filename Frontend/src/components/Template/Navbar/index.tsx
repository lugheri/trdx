import useAuth from "../../../hooks/useAuth";
import { useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink, useLocation} from 'react-router-dom';
import Logo from '/img/logo.png'
import { Student } from "../../../contexts/Dtos/auth.dto";

export const Navbar = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null


  const [mobileNav, setMobileNav ] = useState<'open'|'closed'>('closed')
  return (
    <>
      {/*Mobile*/}
      <div className="text-white flex h-[60px] flex-col md:hidden relative">
        <div className="flex px-4 justify-between bg-[#1B1B1B] items-center flex-1">
          <img src={Logo} className="w-1/4 my-2"/>
          <div className="flex flex-1 items-center justify-end">
            <div className="flex mx-1 w-[30px] h-[30px] hover:w-full justify-center items-center text-white rounded-full text-sm bg-[#353535] cursor-pointer opacity-90 hover:opacity-100">
              <FontAwesomeIcon icon={Fas.faSearch}/>
            </div>
            <div className="flex ml-1 w-[30px] h-[30px] justify-center items-center text-black rounded-[8.226px] text-sm bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md cursor-pointer opacity-90 hover:opacity-100" 
              onClick={()=>setMobileNav(mobileNav === 'closed' ? 'open':'closed')}>
              <FontAwesomeIcon icon={mobileNav === 'closed' ? Fas.faEllipsisV:Fas.faCaretDown}/>
            </div>
          </div>         
        </div> 
        { mobileNav === 'open' && 
        <div className="absolute z-10 bg-[#1B1B1B] flex flex-col w-full p-2 top-[60px]">
          <div className="flex justify-between items-center">
            {/*PROFILE*/}
            <div className="flex flex-col flex-1">
              <div className="flex justify-start items-center">
                <div className="w-[40px] h-[40px] rounded-full p-[1px] mr-2 bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] ">
                  <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-300 text-gray-600">
                  <FontAwesomeIcon icon={Fas.faUser}/>
                  </div>
                </div>
                <p className="font-light text-sm text-slate-300">{userData?.name}</p>
              </div>
              <div className="flex w-[70%] justify-start items-center mt-2">
                <div className="w-[80%] h-[10px] p-[1px]  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded-md shadow">
                  <div className="w-full h-full bg-[#1B1B1B] rounded-md shadow"> </div>
                </div>
                <p className="font-light text-xs ml-2 text-slate-300">0 %</p>
              </div>   
            </div>    
            <NavLink to={'/Profile'} className="flex mx-1 w-[30px] h-[30px] justify-center items-center text-white cursor-pointer opacity-80 hover:opacity-100">
              <FontAwesomeIcon icon={Fas.faCog}/>
            </NavLink>                 
          </div>
          <div className="flex flex-wrap">
            <SideItem 
                to={`/`} 
                name='Inicio' 
                icon='faHome'
                onClick={()=>setMobileNav('closed')}/>  
              <SideItem 
                to={`/coursesGallery`} 
                name='Meus Cursos' 
                icon='faChalkboard'
                onClick={()=>setMobileNav('closed')}/>  
              <SideItem 
                to={`/instagram`} 
                name='Instagram' 
                icon='faCameraRetro'
                onClick={()=>setMobileNav('closed')}/>  
              <SideItem 
                to={`/youtube`} 
                name='Canal do Youtube' 
                icon='faPlay'
                onClick={()=>setMobileNav('closed')}/>  
            </div>
          </div>}
      </div>
     
     
      {/*Web*/}
      <div className="text-white  justify-end items-center px-4 h-14  hidden md:flex">
        {/*ACTIONS*/}
        <div className="flex justify-center items-center">                 
          <div className="group opacity-50 text-xl p-2 hover:opacity-100 cursor-pointer mx-2 flex justify-center items-center">
            <FontAwesomeIcon className="text-gray-300 block group-hover:hidden" icon={Fas.faDoorClosed}/>
            <FontAwesomeIcon className="text-red-800 hidden group-hover:block" icon={Fas.faDoorOpen}/>
            <p className="mx-2 text-sm group-hover:text-red-500">Sair</p>
          </div>
          {/*PROFILE*/}         
          
        </div>  
      </div>
      
    </>
  )
}


const SideItem : React.FC<{to:string;icon:keyof typeof Fas|null;name?:string;onClick?:() => void;}> = (props) => {
  const location = useLocation();
  const isActiveNav = location.pathname === props.to;

  const navDefault = "flex w-[45%] justify-start items-center bg-[#0f0f0f] text-white mx-2 mt-2 h-12 rounded-md opacity-90 hover:opacity-100 ease-in duration-150"
  const navActive = "flex w-[45%] justify-start items-center bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md text-black mx-2 mt-2 h-12 rounded-md opacity-90 hover:opacity-100 ease-in duration-150"
   
  return(
     <NavLink
      to={props.to}
      className={({ isActive, isPending }) =>isActive ? navActive : isPending ? navDefault : navDefault}>
      {props.icon ? (<FontAwesomeIcon className={`px-4 ml-3 opacity-60 ${isActiveNav ? "text-black":"text-[#00ff00]"}`} icon={Fas[props.icon] as IconProp}/>) : false}
      {props.name ? (<p className="text-xs">{props.name}</p>) : false}      
    </NavLink>
  )
}