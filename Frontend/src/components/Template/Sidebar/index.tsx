import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import Brand from '/img/brand.png'
import { Student } from '../../../contexts/Dtos/auth.dto';
import { StudentProfilePhoto } from '../../StudentProfilePhoto';
import api from '../../../services/api';

/*ICONS */
import Home from '/img/svg/home.svg';
import HomeActive from '/img/svg/home_active.svg';
import Book from '/img/svg/book.svg';
import BookActive from '/img/svg/book_active.svg';
import Insta from '/img/svg/insta.svg';
import InstaActive from '/img/svg/insta_active.svg';
import Community from '/img/svg/comunidade.svg';
import CommunityActive from '/img/svg/comunidade_active.svg';
import Ytube from '/img/svg/youtube.svg';
import YtubeActive from '/img/svg/youtube_active.svg';
import Exit from '/img/svg/exit.svg';

type Props = {
  userData:Student,
  typeAccess:'community' | 'default'
}
export const Sidebar = (props:Props) => { 
  const [ progress, setProgress] = useState(0);   
  const getProgress = async () => {
    try{
      const prog = await api.get(`progressStudent/${props.userData.id}`)     
      setProgress(prog.data.response)      
      console.log(progress)  
    }catch(e){
      console.log(e)
    }
  }


  useEffect(()=>{  
    getProgress()
  },[])

  const side = [
    {to:"/",icon:Home,iconActive:HomeActive,target:"",name:"Home"},
    {to:"/coursesGallery",icon:Book,iconActive:BookActive,target:"",name:"Meus Cursos"},
    props.typeAccess === "community" && {to:"/communityStudent",icon:Community,iconActive:CommunityActive,target:"",name:"Comunidade"},
    {to:"https://www.instagram.com/guilhermecardosox/",icon:Insta,iconActive:InstaActive,target:"_blank",name:"Instagram"},
    {to:"https://www.youtube.com/c/GuilhermeCardoso",icon:Ytube,iconActive:YtubeActive,target:"_blank",name:"Canal do Youtube"},
    {to:"/Profile",icon:"Profile",iconActive:"",target:"",name:"Minha Conta"},
    {to:"/Logoff",icon:Exit,iconActive:Exit,target:"",name:"Sair"},
  ]
  
  return(
    <div className="h-full fixed z-20 group overflow-auto hover:transition-all duration-500 
                    /*Mobile**/ hidden w-[16%] hover:w-[80%]
                    /*Tablet*/ md:flex md:w-20 md:hover:w-[35%]
                    /*Desktop*/ lg:flex lg:w-20 lg:hover:w-[18%]
                    /*TV******/ 2xl:flex 2xl:w-24 2xl:hover:w-[18%]">
      <div className="side-blur absolute w-full h-full"/>
      <div className="absolute w-full h-full flex flex-col justify-center items-center hover:px-4">
        <img src={Brand} className="w-[30%] group-hover:w-[15%] h-auto"/>
        <StudentProfilePhoto 
          student_id={props.userData.id} 
          photo_id={0} 
          autoUpdate={true} 
          class="w-[50px] h-[50px] my-4 group-hover:hidden"/>

        <ProfileInfo 
          userData={props.userData} 
          progress={progress}
          className="hidden group-hover:flex group-hover:transition-all group-hover:duration-1000 "/>

        <div className="flex flex-col w-full px-4 group-hover:px-8">
          <ul>
            {side.map((item,key)=>
              item && (
              <>            
                <ItemSide 
                  studentId={props.userData.id} 
                  key={key}
                  to={item.to} 
                  target={item.target}
                  icon={item.icon}
                  iconActive={item.iconActive}
                  name={item.name} 
                  classButton="w-auto justify-center group-hover:w-[100%] group-hover:justify-start group-hover:pl-4"
                  classText="hidden group-hover:flex" />
              </>
              )
            )}           
          </ul>
        </div>        
      </div>
    </div>
  )
}

type ProfileComponent = {
  className:string,
  userData:Student|null,
  progress:number
}
const ProfileInfo:React.FC<ProfileComponent> = (props) => {
  return(
    <div className={`${props.className} transition-all duration-1000 flex flex-col justify-center items-center my-4 w-full px-4`}>
      <StudentProfilePhoto 
        student_id={props.userData ? props.userData.id : 0} 
        photo_id={0} 
        autoUpdate={true} 
        class="w-[80px] h-[80px]"/>
      <p className="font-light text-sm mt-2 text-slate-300">
        {props.userData?.name}
      </p>
      <div className="w-full flex flex-col justify-center items-center px-2 py-2 bg-gradient-to-tr from-gray-700 to-neutral-600 rounded-md mt-4">
        <p className="font-light text-xs mb-1 text-slate-300">Seu Progresso</p>
        <div className="w-full h-[10px] p-[1px]  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded-md shadow" title={`${props.progress}%`}>
          <div className="w-full h-full bg-neutral-800 rounded-md shadow">
            <div className="h-full  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded duration-1000 ease-out" style={{width:`${props.progress}%`}}></div>
          </div>
        </div>        
      </div>
    </div>
  )
}

type ItemSideComponent = {
  studentId:number,
  to:string,
  name:string,
  target:string,
  icon:string,
  iconActive:string,
  classButton:string,
  classText:string
}
const ItemSide:React.FC<ItemSideComponent> = (props) => {
  const location = useLocation();
  const isActiveNav = location.pathname === props.to;
  const itemDefault = props.classButton+" flex items-center rounded my-2 p-2 text-white font-light hover:bg-neutral-950 hover:text-[#00ff00] "
  const itemActive = props.classButton+" flex items-center rounded my-2 p-2 bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md"
  return(
    <NavLink
      to={props.to} 
      target={props.target}
      className={({ isActive }) =>isActive ? itemActive : itemDefault}>
      {props.icon === "Profile" ? <StudentProfilePhoto student_id={props.studentId} photo_id={0} autoUpdate={false} class="w-[30px] h-[30px]"/>
       : isActiveNav ? <img src={props.iconActive}/> : <img src={props.icon}/> }
      <p className={`${props.classText} mx-2 text-xs`}>{props.name}</p>      
    </NavLink>
  )
}
