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
    <div 
      className="relative flex flex-col" 
      style={{
        background: `linear-gradient(to bottom,rgba(9, 9, 9, 0),
                                             rgba(9, 9, 9, 0.4),
                                             rgba(9, 9, 9, 0.6),
                                             rgba(9, 9, 9, 0.9),
                                             rgba(9, 9, 9, 1),
                                             rgba(9, 9, 9, 1),
                                             rgba(9, 9, 9, 1)),
                     url(${urlBase}/gallery/bg-text-1.jpg)`,
        backgroundSize:'100% auto',
        backgroundRepeat:'no-repeat'
      }}>
      <div className="my-[250px] mr-4 ml-20 lg:ml-28 xl:ml-28 2xl:ml-28">
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
  const [ progress, setProgress] = useState(0);
  const [ dataCourse, setDataCourse ] = useState< ICourse | null>(null)
  const [ validityCourse, setValidityCourse] = useState(null);
  const [ progressCourse, setProgressCourse] = useState(0);
  const getDataCourse = async () => {
    try{
      const prog = await api.get(`infoCourse/${props.infoCourse.id}`)
      setDataCourse(prog.data.response)        
    }catch(e){console.log(e)}
  }
  const getProgress = async () => {
    try{
      const prog = await api.get(`progressCourse/${props.infoCourse.id}/${props.userId}`)
      setProgress(prog.data.response)      
      console.log(progress)  
    }catch(e){console.log(e)}
  }
  const checkValidity = async () => {
    try{
      const contract = await api.get(`validityCourse/${props.infoCourse.id}/${props.userId}`)
      setValidityCourse(contract.data.response)    
      console.log(validityCourse)    
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
    getProgress()
    checkValidity()
    getProgressCourse()
  },[props.infoCourse])  

  return(
    <div onClick={()=>openCourse()}
         className="flex flex-col p-2 w-full px-3 mb-4 md:w-[30%] md:mx-[.25%] md:mb-1 opacity-90 cursor-pointer hover:opacity-100">
      <div className="bg-slate-300 w-full h-[200px] rounded-xl flex justify-center items-center overflow-hidden">
        <RenderImageGallery className="w-full h-full" imageId={props.infoCourse.default_thumb}/>
      </div>
      <p className="text-white text-sm mb-2 font-bold min-h-[50px] flex items-center">{dataCourse?.name}</p>
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

