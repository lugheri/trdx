import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Student } from "../../../contexts/Dtos/auth.dto";
import api from "../../../services/api";
import { ICourse, IModules } from "../Dtos/courses.dto";
import { Loading } from "../../../components/Loading";
import { urlBase } from "../../../utils/baseUrl";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div className="flex flex-col overflow-hidden h-[92vh]">
      <div className="flex h-[20%] md:h-[60%] m-2 bg-green-500 rounded-md overflow-hidden relative">
        <RenderImage className="w-full h-auto" imageId={infoCourse.image}/>
        <div 
          className="flex z-10 absolute cursor-pointer px-4 py-2 bg-black/70 hover:bg-black top-[50%] md:top-[40%] right-0 text-white font-light"
          onClick={()=>openModule()}>
          { progressCourse == 0 ?
            <div className="flex w-full h-full items-center">
              <div className="w-[60px] h-[35px] md:w-[100px] md:h-[55px] bg-slate-300 pr-4">
                <RenderImage className="w-full h-full" imageId={infoCourse.image}/>
              </div>
              <p className="px-2 md:px-6 text-sm">Iniciar Curso <FontAwesomeIcon className="pl-4" icon={Fas.faChevronRight}/></p>
            </div>
          : <div className="flex w-full h-full items-center">           
              <div className="w-[60px] h-[35px] md:w-[100px] md:h-[55px] bg-slate-300 pr-4"></div>
              <p className="px-2 md:px-6 text-sm">Continuar Curso <FontAwesomeIcon className="pl-4" icon={Fas.faChevronRight}/></p>
            </div>
          }
        </div>
        <div className="bg-gradient-to-b from-transparent via-[#070707]/80 to-[#070707] absolute w-full h-1/2 bottom-0"/>
      </div>
      <div className="flex flex-1 m-2 md:absolute md:w-[84vw] h-[50vh] bottom-0">
        <ModulesCourse courseId={parseInt(courseId, 10)} userId={userData ? userData.id : 0}/>
      </div>
    </div>
  )
}


const ModulesCourse : React.FC<{courseId:number,userId:number}> = (props) => {
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  useEffect(()=>{
    const getModules = async () => {
      try{
        const mdl = await api.get(`modulesCourse/${props.courseId}`) 
        setModules(mdl.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getModules()
  },[])
  const [ margin, setMargin ] = useState<number>(0)  
  const moveLeft = (modules:number) => {
    const maxLeft = modules * 300
    console.log(maxLeft)
    const newPosition = margin + 300 >= 0 ? 0 : margin + 600
    setMargin(newPosition)
  }
  const moveRight = (modules:number) => {
    const maxLeft = (modules-1) * 300

    const newPosition = margin - 300 <= -maxLeft ? -maxLeft : margin - 300
    setMargin(newPosition)
  }

  return(
    modules === null ? <Loading/> :
    modules.length == 0 ? 
      <div className="flex items-center w-full flex-col p-4">
        <FontAwesomeIcon className="text-4xl text-red-400" icon={Fas.faFrown}/>
        <p className="mt-2 text-lg text-neutral-400">Parece que não existe nenhum módulo liberado neste curso.</p>
        <p className="mt-1 text-sm text-neutral-400 ">Entre em contato com a equipe de suporte ou tente novamente mais tarde!</p>
      </div> 
    :      
      <div className="flex flex-col flex-1 overflow-x-hidden">
        <div className="flex h-full w-full overflow-hidden relative">
          <div className="w-[10%] md:w-[5%] absolute bg-gradient-to-r from-[#070707] to-transparent  h-[70vh] md:h-full flex z-10 justify-center items-center">
            <button
              className="border w-9 h-9 rounded-full border-[#2eff2a] bg-[#2eff2a22] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                onClick={()=>moveLeft(modules.length)}>
                <FontAwesomeIcon icon={Fas.faChevronLeft}/>
            </button>
          </div>
          <div className="flex w-[100%] mx-1 overflow-hidden ">
            <div className="flex w-auto p-1 duration-300 ease-out" style={{marginLeft:`${margin}px`,width:`${modules.length*350}px`}}>
              {modules.map((module,key) =><ModuleCard key={key} module={module} userId={props.userId} />)}
            </div>
          </div>
          <div className="w-[10%] md:w-[5%] absolute right-0 bg-gradient-to-l  from-[#070707] to-transparent h-[70vh] md:h-full flex z-10 justify-center items-center">
            <button
              className="border w-9 h-9 rounded-full border-[#2eff2a] bg-[#2eff2a22] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                onClick={()=>moveRight(modules.length)}>
                <FontAwesomeIcon icon={Fas.faChevronRight}/>
            </button>
          </div>          
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
      className="blur-background flex flex-col justify-between py-4 items-center w-[300px] md:w-[300px] mr-2 rounded shadow shadow-slate-600 h-full  hover:bg-neutral-800 hover:scale-[1.02] cursor-pointer duration-150 ease-out">
      <div className="flex flex-col flex-1 w-full justify-center item-center">
        <FontAwesomeIcon className="text-4xl mb-2 text-[#2eff2a]" icon={Fas.faChalkboard}/>
        <p className="font-bold text-neutral-200 text-center">{props.module.module}</p>
        <p className="text-neutral-400 text-sm mx-2 mt-2 font-light text-center">{props.module.description}</p>
      </div>
      <div className="flex rounded-full overflow-hidden bg-gradient-to-r from-[#24ff0055] to-[#2eff2a] h-[18px] w-[90%] p-[1px]">
        <div className="flex items-center h-full w-full bg-neutral-700  shadow rounded-full overflow-hidden relative">
          <div className="h-full bg-gradient-to-l from-[#24ff0055] to-[#2eff2a] duration-1000 ease-out" style={{width:`${progressModule}%`}}></div>
          <p className="absolute w-full left-0 top-0 justify-center text-xs font-bold text-black h-full flex items-center">{progressModule}% Concluido</p>
        </div>
      </div>
      
    </div>
  )
}

const RenderImage : React.FC<{className:string,imageId:number}> = (props) => {
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
    fileImage == null ? <Loading/> : 
    <div 
      className={props.className} 
      style={{backgroundImage:`url(${urlBase}/gallery/${fileImage})`,
              backgroundSize:'cover',
              backgroundPosition:'top center'}}/>
  )
}