import { useState, useEffect} from 'react';
import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ILessonsModule, IModules } from "../../Dtos/courses.dto";
import api from '../../../../services/api';
import { useNavigate } from 'react-router-dom';

type ISideModule = {
  studentId:number,
  courseId:number,
  moduleOpen:number,
  setModuleOpen:React.Dispatch<React.SetStateAction<number>>,
  lessonId:number,
  setLessonId:React.Dispatch<React.SetStateAction<number>>
}

export const SideModule: React.FC<ISideModule> = (props) => {
  const navigate = useNavigate();
  const backCoursePage = () => {
    const hash_CourseId: string = btoa(`[{"courseId":"${props.courseId}"}]`);
    navigate(`/classRoom/course/${hash_CourseId}`)
  }
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  useEffect(()=>{
    const getModules = async () => {
      try{
        const listModules = await api.get(`modulesCourse/${props.courseId}`)
        setModules(listModules.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getModules()   
  },[])

  return(
    <div className="flex flex-col">
      <div className="bg-[#151515] opacity-80 hover:opacity-100 cursor-pointer flex justify-center items-center p-2 mb-2"
           onClick={()=>backCoursePage()}>
        <p className="text-white font-light text-sm"><FontAwesomeIcon icon={Fas.faArrowLeft}/> Ver todos os módulos</p>
      </div>
      { modules === null ? 
        <div className="flex flex-col w-full px-2 text-white">
          <FontAwesomeIcon icon={Fas.faCircleNotch} pulse/> 
          Carregando Módulos 
        </div> 
        : modules.length == 0 ? 
        <div className="flex flex-col w-full px-2 text-white">
          <FontAwesomeIcon icon={Fas.faBan}/> 
          Nenhum Módulo Cadastrado 
        </div> 
        : modules.map((module,key)=>
          <div key={key}>
            { props.moduleOpen === module.id ?
            <>
            <div  className="bg-gradient-to-l from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md text-black mb-2 h-12 rounded-md
                                      flex justify-between items-center px-2 cursor-pointer"
                onClick={()=>props.setModuleOpen(module.id)}>
              <p className="text-xs">{module.module}</p>
              <FontAwesomeIcon className="text-xs" icon={Fas.faChevronUp}/> 
            </div>
            <LessonsModule course_id={props.courseId} module_id={props.moduleOpen} student_id={props.studentId}  lesson_id={props.lessonId} setLessonId={props.setLessonId}/>
            </>
            : 
            <div key={key} className="bg-[#101010] text-white flex justify-between items-center mb-2 px-2 h-12 font-light hover:font-semibold opacity-80 hover:opacity-100 cursor-pointer"
                onClick={()=>props.setModuleOpen(module.id)}>
              <p className="text-xs">{module.module}</p>
              <FontAwesomeIcon className="text-xs" icon={Fas.faChevronDown}/> 
            </div>
            }
          </div>
        )
      }
    </div>     
  )  
}


type ILessonsModuleComponent = {
  module_id:number,
  course_id:number,
  student_id:number,
  lesson_id:number,
  setLessonId:React.Dispatch<React.SetStateAction<number>>
}

const LessonsModule : React.FC<ILessonsModuleComponent> = (props) => {
  const [ lessons, setLessons ] = useState<ILessonsModule[] | null>(null)
  useEffect(()=>{ 
    const getLessons = async () => {
      try{
        const listLessons = await api.get(`lessonsModule/${props.course_id}/${props.module_id}/${props.student_id}`)
        setLessons(listLessons.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getLessons()
  },[])
  return(
    <div className="flex flex-col">
      { lessons === null ? 
        <div className="flex flex-col w-full px-2 text-white">
          <FontAwesomeIcon icon={Fas.faCircleNotch} pulse/> 
          Carregando Aulas 
        </div> 
        : lessons.length == 0 ? 
        <div className="flex flex-col w-full px-2 text-white">
          <FontAwesomeIcon icon={Fas.faBan}/> 
          Nenhuma aula disponível 
        </div> 
        : lessons.map((lesson,key)=>
          <div key={key} 
               className={`bg-[#101010] text-white  mb-2 px-2 h-16 font-light hover:font-semibold opacity-80 hover:opacity-100 cursor-pointer flex justify-between items-center
                          ${props.lesson_id === lesson.id && " border border-[#2eff2a]"}`}
              onClick={()=>props.setLessonId(lesson.id)}>
            <div className="flex flex-1 justify-start items-center">
              <div className="w-[75px] h-12 bg-slate-300"></div>
              <p className="w-[70%] text-xs pl-2">{lesson.name}</p>
            </div>            
            <FontAwesomeIcon className="text-[#2eff2a]" icon={lesson.LessonsViewed ? Fas.faCheckSquare : Far.faSquare}/> 
          </div>
        )
      }
    </div>
  )

}