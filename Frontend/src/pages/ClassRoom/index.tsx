import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ICourse, ILessons, IModules } from "../Dtos/courses.dto";
import api from "../../services/api";
import { Loading } from "../../components/Loading";
import { Card } from "../../components/Cards";
import { urlBase } from "../../utils/baseUrl";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
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
  const [ lessonId, setLessonId ] = useState<number>(0)

  return (
    <div className="flex ">
      <div className="flex flex-1 flex-col h-[93vh] overflow-auto">
        { lessonId === 0 ? <Card component={<div className="h-[500px]">Player Aula</div>}/> : <Player lessonId={lessonId}/>}
        <Card component={<div className="h-[1000px]">Comentarios Curso {courseId}</div>}/>
      </div>
      <div className="flex w-1/3 flex-col mr-2 mt-2 relative h-[92vh] overflow-hidden">
        <SideBarCurso courseId={courseId}  moduleId={moduleId} lessonId={lessonId} setLessonId={setLessonId}/>
        <SideActions/>
      </div>
    </div>
  )
} 

const Player: React.FC<{lessonId:number}> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessons|null>(null)
  useEffect(()=>{
    const getInfoLesson = async () => {
      try{
        const il = await api.get(`infoLesson/${props.lessonId}`)
        setInfoLesson(il.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getInfoLesson()
  },[props.lessonId])
  return(
    infoLesson === null ? <Loading/> :
      <div className="flex flex-col p-1 w-full items-center">
        <div className="block w-[770px] h-[443px] p-0 overflow-hidden shadow-md shadow-teal-500">
          <iframe className="w-full h-full" width="100%" height="200" allow="autoplay; fullscreen" 
            src={`https://player.vimeo.com/video/12696355?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        </div>
        {/* Controllers */}  
        <div className="flex w-full p-4 justify-between">
          <div className="flex flex-col flex-1 justify-start">
            <p className="text-slate-800 dark:text-white text-lg">{infoLesson.name}</p>
            <p className="text-slate-600 dark:text-slate-400 text-xs">{infoLesson.description}</p>
          </div> 
          <div className="flex">
            <Button name="Concluir Aula" btn="muted" size="sm" icon="faCheck" type="outline"/>            
          </div>
        </div>
      </div>
  ) 
}

const SideBarCurso : React.FC<{courseId:number,moduleId:number,lessonId:number,setLessonId:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
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
    <div className="flex flex-col min-h-[500px] max-h-[550px] bg-gradient-to-b from-slate-500 dark:from-slate-950 to-slate-400 dark:to-slate-900  rounded overflow-hidden">
      {
      modules === null ? <Loading/> : 
      modules.length == 0 ? <p>Nenhum modulo ativo</p> :
      modules.map((module,key)=>
        <div 
          style={{maxHeight:`${module.id == moduleOpen ? 585-(modules.length*35)+'px' : 'auto' }`}}
          key={key}
          className={`flex flex-col`}>
          
          <div className={`flex border-l-8 border-teal-800 dark:border-teal-500 justify-start items-center cursor-pointer ${module.id == moduleOpen ? `bg-white text-teal-800 dark:bg-slate-900 dark:text-green-400  h-[40px] `:"border-b border-b-slate-700 h-[35px] text-teal-800 dark:text-teal-500 opacity-40 bg-white dark:bg-slate-800 hover:bg-slate-50 hover:dark:bg-slate-800 hover:opacity-80"}`}
               onClick={()=>setModuleOpen(module.id == moduleOpen ? 0 : module.id)}>
            <p className="font-bold text-sm">
              <FontAwesomeIcon className="ml-6 mr-4 opacity-70" icon={module.id == moduleOpen ? Fas.faFolderOpen : Fas.faFolder }/>
              {module.module}
            </p>
          </div>
          
            { module.id != moduleOpen ? false :  
              <div 
                className={` overflow-auto`}>
                <div 
                  className={`flex flex-col items-start overflow-hidden`}> 
                  { lessonsModule === null ? <Loading/> : 
                    lessonsModule.length == 0 ? <p className="text-center w-full p-4 text-slate-400">Nenhuma aula localizada</p> : 
                    lessonsModule.map((lesson,key)=>
                      <LessonButton key={key} lesson={lesson} lessonId={props.lessonId} setLessonId={props.setLessonId}/>
                    )} 
                </div>
              </div>               
            }

        </div>
      )}
    </div>
  )
}
const LessonButton : React.FC<{lesson:ILessons, lessonId:number, setLessonId:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
  return(
    <button
      onClick={()=>props.setLessonId(props.lesson.id)} 
      className={`flex hover:opacity-90 bg-slate-100 dark:bg-slate-700 border-b border-slate-500 ${props.lessonId === props.lesson.id ? "text-teal-950 dark:text-teal-500 opacity-100" : "text-slate-900 dark:text-white opacity-50" } w-full pl-2 h-[50px] justify-between items-center text-sm p-1`}>
      <p className="text-left max-w-[60%] flex justify-center items-center">
        <FontAwesomeIcon  fade={props.lessonId === props.lesson.id ? true : false } className="text-green-400 ml-1 mr-2" icon={Fas.faPlay}/>  {props.lesson.name}</p>
        {props.lessonId === props.lesson.id ? 
          <Button name="Assistindo Agora" btn="success"  border="circle" size="sm"/>
        : <Button name="Assistir a aula" btn="light" type="notline" border="circle" size="sm"/> }
    </button>
  )
}
const SideActions = () => {
  return(
    <div className="flex flex-col items-center bg-slate-700 h-[40px] hover:h-[200px] w-[90%] duration-500 ease-out absolute bottom-0 right-4 rounded-t-xl p-2 shadow">
      <p className="font-bold text-teal-500"><FontAwesomeIcon className="text-green-500" icon={Fas.faTools}/> Ferramentas</p>
      <Button name="Anotações" block btn="success" type="outline"/>
      <Button name="Anexos" block btn="success" type="outline"/>
      <Button name="Questionários" block btn="success" type="outline"/>
    </div>
  )
}
