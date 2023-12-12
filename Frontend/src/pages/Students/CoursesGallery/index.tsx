import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../../hooks/useAuth"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TitlePage } from "../../../components/Template/TitlePage"
import { Student } from '../../../contexts/Dtos/auth.dto';
import { ICourse, IMyCourses } from '../Dtos/courses.dto';
import api from '../../../services/api';
import { Loading } from '../../../components/Loading';
import { urlBase } from '../../../utils/baseUrl';
import { RenderImageGallery } from '../../../components/RenderImageGallery';
import Logo from '/img/logo.png'


export const CoursesGallery = () => {
  const authenticated = useAuth(); 
  const userData:Student|null = authenticated ? authenticated.userData : null
  const [ listMyCourses, setListMyCourses ] = useState<IMyCourses[]|null>(null)
  const getMyCourses = async () => {
    try{
      const mc = await api.get(`myCourses/${userData?.id}`)
      setListMyCourses(mc.data.response)
    }catch(e){ console.log(e)}    
  }
  useEffect(()=>{ userData ? getMyCourses() : false },[userData])
  return(
    <div className="relative flex flex-col bg-black" 
      style={{
        backgroundImage: `url(${urlBase}/gallery/bg-home-candles.jpg)`,
        backgroundSize:'100%',
        backgroundRepeat:'no-repeat'
        }}>
        
      <div className="my-[80px] mr-4 ml-4 md:ml-28 lg:my-[300px]
                    lg:ml-28 xl:ml-28 2xl:ml-28">
        <TitlePage title="Meus cursos"/>
        <div className="flex">
          <div className="w-full flex flex-wrap">
            { listMyCourses === null ? <Loading/> : listMyCourses.length == 0 ? <Empty/> : 
              listMyCourses.map((course,key)=>(<Course key={key} infoCourse={course} userId={userData? userData.id : 0}/>
            ))}              
          </div>
        </div> 
      </div>    
    </div>
  )
}

const Course : React.FC<{infoCourse:IMyCourses;userId:number}> = (props) => {
  //const [ fileImage, setFileImage ] = useState(null)
  const navigate = useNavigate(); 
  const [ dataCourse, setDataCourse ] = useState< ICourse | null>(null)
  const [ validityCourse, setValidityCourse] = useState(null);
  const [ progressCourse, setProgressCourse] = useState(0);
  const getDataCourse = async () => {
    try{
      const prog = await api.get(`infoCourse/${props.infoCourse.id}`)
      setDataCourse(prog.data.response)        
    }catch(e){console.log(e)}
  } 
  const checkValidity = async () => {
    try{
      const contract = await api.get(`validityCourse/${props.infoCourse.id}/${props.userId}`)
      setValidityCourse(contract.data.response) 
    }catch(e){console.log(e)}
  }
  const getProgressCourse = async () => {
    try{
      const prog = await api.get(`progressCourse/${props.infoCourse.id}/${props.userId}`)
      setProgressCourse(prog.data.response)        
    }catch(e){console.log(e)}
  }
  const openCourse = () => {
    const hash_CourseId: string = btoa(`[{"courseId":"${props.infoCourse.id}"}]`);
    navigate(`/classRoom/course/${hash_CourseId}`)
  }
  useEffect(()=>{
    getDataCourse()
    checkValidity()
    getProgressCourse()
  },[props.infoCourse]) 

  return(
    <div onClick={()=>openCourse()}
         className="flex flex-col relative p-2 w-full px-3 mb-4 md:w-[30%] md:mx-[.25%] md:mb-1 opacity-90 cursor-pointer hover:opacity-100">
     { props.infoCourse.default_thumb  
       ? <RenderImageGallery className="w-full rounded-xl" imageId={props.infoCourse.default_thumb} imgTag/>
       : props.infoCourse.background_image 
         ? <RenderImageGallery className="w-full rounded-xl" imageId={props.infoCourse.background_image} imgTag/>
         : <div className="flex justify-center items-center p-2 rounded-xl bg-black h-[180px]">
            <img className="w-1/2" src={Logo}/>
          </div>
      }
      { validityCourse == 'not_have' 
        ? <p className="text-red-500 text-white absolute top-[20px] left-6 p-1 text-xs rounded shadow"><FontAwesomeIcon icon={Fas.faLock}/></p> 
        : validityCourse == 'expired' && <p className="bg-pink-800 text-white absolute top-[20px] left-6 p-1 text-xs rounded shadow"><FontAwesomeIcon icon={Fas.faCalendarTimes}/> Acesso Expirado</p> }
     
      <p className="text-white text-sm mb-2 font-bold min-h-[50px] flex items-center">{props.infoCourse.name}</p>
      <p className="text-gray-100 text-xs font-light">{progressCourse}% concluido</p>
      <div className="w-1/2 md:w-full h-[10px] p-[1px]  mb-4 bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded-md shadow">
        <div className="w-full h-full bg-neutral-900 rounded-md shadow overflow-hidden"> 
          <div className="h-full  bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] rounded duration-1000 ease-out" style={{width:`${progressCourse}%`}}></div>
        </div>
      </div>
      <p className="text-white text-sm font-thin md:min-h-[150px] flex items-start">{dataCourse == null ? "" : dataCourse.description.length > 150 ? dataCourse.description.slice(0, 145) + ' . . . ' : dataCourse.description}</p>
    </div>  
  )
}
const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full  text-slate-400 dark:text-slate-200">
      <FontAwesomeIcon className="text-3xl opacity-60 mb-2" icon={Fas.faFaceFrown}/> 
      <p>Parece que você ainda não possui nenhum curso</p>
    </div>
  )
}

