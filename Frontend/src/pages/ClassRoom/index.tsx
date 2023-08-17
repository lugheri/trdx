import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ICourse, ILessons, IModules } from "../Dtos/courses.dto";
import api from "../../services/api";
import { Loading } from "../../components/Loading";
import { Card } from "../../components/Cards";
import { urlBase } from "../../utils/baseUrl";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../components/Buttons";
import useAuth from "../../hooks/useAuth";
import { Student } from "../../contexts/Dtos/auth.dto";



export const ClassRoom = () => {
  const location = useLocation();  
  const params = location.pathname.split('/')[4]
  interface LessonObject {
    courseId: string;
    moduleId: string;
  }
  const base64Decoded: LessonObject[] = JSON.parse(atob(params));
  const courseId = parseInt(base64Decoded[0].courseId,10)
  const moduleId = parseInt(base64Decoded[0].moduleId,10)

  return (
    <div className="flex ">
      <div className="flex flex-1 flex-col">
        <Card component={<div className="h-[500px]">Player Aula</div>}/>
        <div>Botoes</div>
        <Card component={<div>Comentarios Curso {courseId}</div>}/>
      </div>
      <div className="flex w-1/3 flex-col m-2 overflow-hidden">
        <SideBarCurso courseId={courseId} moduleId={moduleId}/>
        <div>Botoes</div>
        <Card component={<div>Acoes</div>}/>
      </div>
    </div>
  )
} 

const SideBarCurso : React.FC<{courseId:number,moduleId:number}> = (props) => {
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  const [ moduleOpen, setModuleOpen ] = useState<number>(props.moduleId)
  useEffect(()=>{
    const getModules = async () => {
      try{
        const mdl = await api.get(`/modulesMyCourse/${props.courseId}`)
        setModules(mdl.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getModules()
  },[])
  const [ lessonsModule, setLessonsModule ] = useState<ILessons[]|null>(null)
  useEffect(()=>{
    const getLessons = async () => {
      setLessonsModule(null)
      try{
        const lm = await api.get(`/lessonsModule/${props.courseId}/${moduleOpen}`)
        setLessonsModule(lm.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getLessons()
  },[props.courseId,moduleOpen])

  return(
    <div className="flex flex-col h-[550px] bg-gradient-to-b from-slate-950 to-slate-900  rounded overflow-hidden">
      {
      modules === null ? <Loading/> : 
      modules.length == 0 ? <p>Nenhum modulo ativo</p> :
      modules.map((module,key)=>
        <div 
          style={{maxHeight:`${module.id == moduleOpen ? 585-(modules.length*35)+'px' : 'auto' }`}}
          key={key}
          className={`flex flex-col`}>
          
          <div className={`flex border-l-8 border-teal-500 justify-center items-center cursor-pointer ${module.id == moduleOpen ? `bg-slate-900 text-green-400  h-[40px] `:"border-b border-b-slate-700 h-[35px] text-teal-500 opacity-40 bg-slate-800 hover:bg-slate-800 hover:opacity-80"}`}
               onClick={()=>setModuleOpen(module.id)}>
            <p className="font-bold text-sm">{module.module}</p>
          </div>
          
            { module.id != moduleOpen ? false :  
              <div 
                className={` overflow-auto rounded-b`}>
                <div 
                  className={`flex flex-col items-start overflow-hidden`}> 
                  { lessonsModule === null ? <Loading/> : 
                    lessonsModule.length == 0 ? <p className="text-center w-full p-4 text-slate-400">Nenhuma aula localizada</p> : 
                    lessonsModule.map((lesson,key)=>
                      <LessonButton key={key} lesson={lesson}/>
                    )} 
                </div>
              </div>               
            }

        </div>
      )}
    </div>
  )
}

const LessonButton : React.FC<{lesson:ILessons}> = (props) => {
  return(
    <button className="flex opacity-50 hover:opacity-90 bg-slate-700 border-b border-slate-500 text-white w-full pl-8 h-[45px] justify-start items-center text-sm p-1">
      <FontAwesomeIcon className="text-green-400 mr-4" icon={Fas.faPlay}/>  {props.lesson.name}
    </button>
  )
}
