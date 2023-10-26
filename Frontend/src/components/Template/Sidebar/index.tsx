import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Fab from "@fortawesome/free-brands-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { NavLink, useLocation } from 'react-router-dom';
import { NavLinkProps } from '../../Dtos/sidebar.dto';
import Logo from '/img/logo.png'
import Brand from '/img/brand.png'
import useAuth from '../../../hooks/useAuth';
import { Student } from '../../../contexts/Dtos/auth.dto';
import { StudentProfilePhoto } from '../../StudentProfilePhoto';
import api from '../../../services/api';


export const Sidebar = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null

  //const version='Alpha Centauri: 1.0.0'
  //const [ version, setVersion ] = useState<string>('Alpha Centauri: 1.0.0')

  
  const [ side, setSide ] = useState<'open'|'closed'>('open')
  const [ sideSize, setSideSize ] = useState<'w-60'|'w-20'>('w-60')
  useEffect(()=>{
    side == 'open' ? setSideSize('w-60') : setSideSize('w-20')    
  },[side])

  return (
    <div className={`flex-col ${sideSize} ease-in duration-150 hidden md:flex`}>
      {/*BRAND*/}
      <div className="h-16 flex justify-center items-center text-cyan-50 font-bold relative">
        {side == 'open' ? (
          <>
            <img src={Logo} className="w-1/2 my-2"/>
            <div className="absolute -right-3 top-5 flex w-[23px] h-[23px] justify-center items-center text-black rounded-[8.226px] text-sm bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md cursor-pointer opacity-90 hover:opacity-100" 
                 onClick={()=>setSide('closed')}>
              <FontAwesomeIcon icon={Fas.faCaretLeft}/>
            </div>
          </>
        ) : (
          <>
            <img src={Brand} className="w-1/3 my-2"/>
            <div className="absolute -right-3 top-5 flex w-[23px] h-[23px] justify-center items-center text-black rounded-[8.226px] text-sm bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md cursor-pointer opacity-90 hover:opacity-100" 
                 onClick={()=>setSide('open')}>
              <FontAwesomeIcon icon={Fas.faBars}/>
            </div>
          </>
        )}        
      </div>
      {/*SIDE*/}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col px-2 flex-1 ">
          { side == 'open' ? <SideProfile userData={userData}/> : false }
          <ul className={`py-2 bg-[#30332f] rounded-t-md flex-1 ${side == 'closed' && "px-2"}`}>
            <SideItem 
              to={`/`} 
              side={side} 
              name='Inicio' 
              icon='faHome'/>  
            <SideItem 
              to={`/coursesGallery`} 
              side={side} 
              name='Meus Cursos' 
              icon='faChalkboard'/>  
            <SideItem 
              to={`https://www.instagram.com/guilhermecardosox/`} 
              side={side} 
              name='Instagram' 
              icon='faCameraRetro'/>  
            <SideItem 
              to={`https://www.youtube.com/c/GuilhermeCardoso`} 
              side={side} 
              name='Canal do Youtube' 
              icon='faPlay'/>  
          </ul>
        </div>
          {/*Side Settings*/}
          <ul className={`py-2 bg-[#30332f] rounded-b-md mx-2 mb-2 ${side == 'closed' && "px-2"}`}>
            <SideItem 
              to={`/Profile`} 
              side={side} 
              name='Minha Conta' 
              icon='faUserCircle'/>  
        </ul>
      </div>
      {/*FOOTER
      <div className="text-center text-cyan-700 dark:text-gray-600 py-2 px-1 text-xs">
        Version: {version}
      </div>*/}
    </div>
  )
}

const SideProfile : React.FC<{userData:Student|null}> = (props) => {
  const [ progress, setProgress] = useState(0);
  useEffect(()=>{
    const getProgress = async () => {
      try{
        const prog = await api.get(`progressStudent/${props.userData ? props.userData.id : 0}`)
        setProgress(prog.data.response)      
        console.log(progress)  
      }catch(e){
        console.log(e)
      }
    }
    getProgress()
  },[])
  return(
    <div className="flex flex-col justify-center items-center mb-4">
      
      <StudentProfilePhoto student_id={props.userData ? props.userData.id : 0} photo_id={0} autoUpdate={true} class="w-[80px] h-[80px]"/>
      <p className="font-light text-sm mt-2 text-slate-300">{props.userData?.name}</p>
    
      <div className="w-full flex flex-col justify-center items-center px-2 py-2 bg-[#30332f] rounded-md mt-4">
        <p className="font-light text-xs mb-1 text-slate-300">Seu Progresso</p>
        <div className="w-full h-[10px] p-[1px]  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded-md shadow" title={`${progress}%`}>
          <div className="w-full h-full bg-slate-500 rounded-md shadow">
            <div className="h-full  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded duration-1000 ease-out" style={{width:`${progress}%`}}></div>
          </div>
        </div>        
      </div>
    </div>
  )
}

const SideItem : React.FC<NavLinkProps> = (props) => {
  const location = useLocation();
  const isActiveNav = location.pathname === props.to;


  const navDefault = "flex justify-start items-center bg-[#0f0f0f] text-white mx-2 mt-2 h-12 rounded-md opacity-90 hover:opacity-100 ease-in duration-150"
  const navActive = "flex justify-start items-center font-semibold bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md text-black mx-2 mt-2 h-12 rounded-md opacity-90 hover:opacity-100 ease-in duration-150"
 
  const navDefaultClosed = "flex flex-col group bg-[#0f0f0f] w-full p-2 mb-2 justify-center items-center font-semibold rounded-md opacity-70 hover:opacity-100 ease-in duration-150"
  const navActiveClosed = "flex flex-col group bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md w-full p-2 mb-2 justify-center items-center font-semibold rounded-md opacity-70 hover:opacity-100 ease-in duration-150"
 
  return(
    props.side == 'open' ? (
      <NavLink
        to={props.to} 
        target={props.name == "Instagram" ? "_blank" : props.name == "Canal do Youtube" ? "_blank" : ""}
        className={({ isActive, isPending }) =>isActive ? navActive : isPending ? navDefault : navDefault}>
        {props.icon ? (<FontAwesomeIcon className={`px-4 ml-3 opacity-60 ${isActiveNav ? "text-black":"text-[#00ff00]"}`} icon={ props.name == 'Instagram' ? Fab.faInstagram : Fas[props.icon] as IconProp}/>) : false}
        {props.name ? (<p className="text-xs">{props.name}</p>) : false}      
      </NavLink>
    ):(
      <NavLink
        className={({ isActive, isPending }) =>isActive ? navActiveClosed : isPending ? navDefaultClosed : navDefaultClosed}
        to={props.to}>
        {props.icon ? (<FontAwesomeIcon className={`py-1 ${isActiveNav ? "text-black":"text-[#00ff00]"}`} icon={ props.name == 'Instagram' ? Fab.faInstagram : Fas[props.icon] as IconProp}/>) : false}  
        {props.name ? (<p className={`hidden group-hover:inline text-[.7rem] ${isActiveNav ? "text-black":"text-[#00ff00]"} text-center font-light transition duration-150 ease-out hover:ease-in`}>{props.name}</p>) : false}         
      </NavLink>
    )
  )
}