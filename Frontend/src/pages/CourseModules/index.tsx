import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ICourse, IModules } from "../Dtos/courses.dto";
import api from "../../services/api";
import { Loading } from "../../components/Loading";
import { Card } from "../../components/Cards";
import { urlBase } from "../../utils/baseUrl";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from "../../hooks/useAuth";
import { Student } from "../../contexts/Dtos/auth.dto";
import { Button } from "../../components/Buttons";

export const CourseModules = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null

  const location = useLocation();  
  const params = location.pathname.split('/')[3]  
  interface CourseObject {
    courseId: string;
  }
  const base64Decoded: CourseObject[] = JSON.parse(atob(params));
  const courseId = base64Decoded[0].courseId

  const [ progressCourse, setProgressCourse] = useState(0);
  useEffect(()=>{
    const getProgressCourse = async () => {
      try{
        const prog = await api.get(`progressCourse/${courseId}/${userData?.id}`)
        setProgressCourse(prog.data.response)        
      }catch(e){
        console.log(e)
      }
    }
    getProgressCourse()
  },[])

  const [infoCourse, setInfoCourse] = useState<ICourse|null>(null)
  useEffect(()=>{
    const getInfoCourse = async () => {
      try{
        const ic = await api.get(`infoCourse/${courseId}`)
        setInfoCourse(ic.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getInfoCourse()
  },[])

   const navigate = useNavigate();  
  const openModule = () => {
    const hash_lessonId: string = btoa(`[{"courseId":"${courseId}","moduleId":"0"}]`);
    navigate(`/classRoom/course/lesson/${hash_lessonId}`)
  }

  return (
    infoCourse === null ? <Loading/> :
    <div className="flex flex-col">
      <div className="flex justify-center item-center p-2">
        <RenderImage className="w-[300px] bg-white m-1 rounded shadow dark:shadow-teal-950" imageId={infoCourse.image}/>
        <div className="flex flex-col justify-center p-4">
          <p className="text-slate-500 dark:text-slate-100 text-3xl font-bold">{infoCourse.name}</p>
          <p className="text-slate-500 dark:text-slate-100 text-lg mt-4">{infoCourse.description}</p>
          <p className="text-slate-500 dark:text-slate-100 mt-4">{infoCourse.author ? `Por: ${infoCourse.author }`: false}</p>
          <p className="text-slate-500 dark:text-slate-100 text-sm mt-4">{infoCourse.tags ? `Tags: ${infoCourse.tags}` : false}</p>
          <div className="flex">
            { progressCourse == 0 ? <Button btn="success" type="outline" size="sm" name="Iniciar Curso" icon="faPlay" onClick={()=>openModule()}/> 
            : <Button btn="success" type="outline" size="sm" name="Continue assistindo" icon="faForwardStep" onClick={()=>openModule()}/>}            
          </div>
          <div className="flex mt-4 items-center h-[18px] bg-slate-500 dark:bg-slate-800 w-[90%] shadow rounded-full overflow-hidden relative">
            <div className="h-full bg-teal-500 duration-1000 ease-out" style={{width:`${progressCourse}%`}}></div>
            <p className="absolute w-full left-0 top-0 justify-center text-xs font-bold text-white h-full flex items-center">{progressCourse}% Concluido</p>
          </div>
        </div>
      </div>
      <Card component={<ModulesCourse courseId={parseInt(courseId, 10)} userId={userData ? userData.id : 0}/>}/>
    </div>
  )
}

const RenderImage : React.FC<{imageId:number,className:string}> = (props) => {
  const [ fileImage, setFileImage ] = useState(null)

  useEffect(()=>{
    const getInfoImage = async () => {
      try{
        const i = await api.get(`infoFile/${props.imageId}`)
        setFileImage(i.data.response.file)
      }catch(e){
        console.log(e)
      }
    }
    getInfoImage()
  },[props.imageId])

  return(
    fileImage ? <img className={props.className} src={`${urlBase}/gallery/${fileImage}`}/> : <Loading/>
  )
}
const ModulesCourse: React.FC<{courseId:number,userId:number}> = (props) => {
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  useEffect(()=>{
    const getModules = async () => {
      try{
        const mdl = await api.get(`modulesMyCourse/${props.courseId}`) 
        setModules(mdl.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getModules()
  },[])

  
  const [ margin, setMargin ] = useState<number>(0)  
  const moveLeft = (modules:number) => {
    const maxLeft = modules * 350
    console.log(maxLeft)
    const newPosition = margin + 350 >= 0 ? 0 : margin + 550
    setMargin(newPosition)
  }
  const moveRight = (modules:number) => {
    const maxLeft = (modules-1) * 350

    const newPosition = margin - 350 <= -maxLeft ? -maxLeft : margin - 350
    setMargin(newPosition)
  }

  return(
    modules === null ? <Loading/> :
      modules.length == 0 ? 
        <div className="flex items-center w-full flex-col p-4">
          <FontAwesomeIcon className="text-4xl text-red-400" icon={Fas.faFrown}/>
          <p className="mt-2 text-lg text-slate-400 dark:text-slate-200">Parece que não existe nenhum módulo liberado neste curso.</p>
          <p className="mt-1 text-sm text-slate-300 dark:text-slate-400">Entre em contato com a equipe de suporte ou tente novamente mais tarde!</p>
        </div> 
      :      
        <div className="flex flex-col flex-1 bg-green overflow-x-hidden">

          <div className="flex justify-between w-full p-2">
            <p className="font-bold text-slate-500 dark:text-slate-300">{modules.length} Módulo(s)</p>
            <div className="flex">
              <button className="text-slate-600 dark:text-slate-50 opacity-50 hover:opacity-100 text-2xl mr-1" onClick={()=>moveLeft(modules.length)}>
                <FontAwesomeIcon icon={Fas.faCaretLeft}/>
              </button>
              <button className="text-slate-600 dark:text-slate-50 opacity-50 hover:opacity-100 text-2xl ml-1" onClick={()=>moveRight(modules.length)}>
                <FontAwesomeIcon icon={Fas.faCaretRight}/>
              </button>              
            </div>
          </div>
          
          <div className="flex w-auto p-1 duration-300 ease-out" style={{marginLeft:`${margin}px`,width:`${modules.length*350}px`}}>
            {modules.map((module,key) =>
              <ModuleCard key={key} module={module} userId={props.userId} />
            )}
          </div>
        </div>
    )
}
const ModuleCard : React.FC<{module:IModules,userId:number}> = (props) => {
  const [ progressModule, setProgressModule] = useState(0);
  useEffect(()=>{
    const getProgressModule = async () => {
      try{
        const prog = await api.get(`progressModule/${props.module.id}/${props.userId}`)
        setProgressModule(prog.data.response)        
      }catch(e){
        console.log(e)
      }
    }
    getProgressModule()
  },[])

  const navigate = useNavigate();  
  const openModule = () => {
    const hash_lessonId: string = btoa(`[{"courseId":"${props.module.course_id}","moduleId":"${props.module.id}"}]`);
    navigate(`/classRoom/course/lesson/${hash_lessonId}`)
  }

  return(
    <div 
      onClick={()=>openModule()}
      className="flex flex-col justify-between py-4 items-center bg-neutral-700 w-[350px] mx-1 rounded shadow shadow-slate-600 dark:shadow-black h-[200px] opacity-90 hover:opacity-100 hover:scale-[1.02] cursor-pointer duration-150 ease-out">
      <div className="flex flex-col flex-1 w-full justify-center item-center">
        <FontAwesomeIcon className="text-4xl mb-2 text-green-500" icon={Fas.faChalkboard}/>
        <p className="font-bold text-neutral-200 text-center">{props.module.module}</p>
        <p className="text-black text-sm text-center">{props.module.description}</p>
      </div>
      <div className="flex  items-center h-[18px] bg-neutral-800 w-[90%] shadow rounded-full overflow-hidden relative">
        <div className="h-full bg-teal-500 duration-1000 ease-out" style={{width:`${progressModule}%`}}></div>
        <p className="absolute w-full left-0 top-0 justify-center text-xs font-bold text-white h-full flex items-center">{progressModule}% Concluido</p>
      </div>
    </div>
  )

}


