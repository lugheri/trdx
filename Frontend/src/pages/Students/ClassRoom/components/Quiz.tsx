import { useEffect, useState } from "react";
import { Student } from "../../../../contexts/Dtos/auth.dto";
import { ISettingsQuiz } from "../../../Admin/Content/Dtos/quiz.dto";
import { ILessons, IModules } from "../../Dtos/courses.dto";
import api from "../../../../services/api";
import { Loading, LoadingBars } from "../../../../components/Loading";

type Props = {
  lessonId:number;
  userdata:Student
} 
export const Quiz = (props:Props) => {
  const [error, setError ] = useState<string|null>(null)
  const [settings, setSettings ] = useState<ISettingsQuiz|null>(null)
  const [ infoLesson, setInfoLesson ] = useState<ILessons|null>(null)
  const getInfoLesson = async () => {
    try{
      const info = await api.get(`infoLesson/${props.lessonId}`)      
      console.log('infoLesson',info.data)
      setInfoLesson(info.data.response)
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao recuperar as informações do questionário')
    }      
  }
  const getQuizSettings = async () => {
    try{
      const info = await api.get(`infoSettingsQuestion/${props.lessonId}`)
      console.log('Settings',info.data)
      if(info.data.success){ 
        setSettings(info.data.response)
        return
      }
      setError('Ocorreu um erro interno')
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao recuperar as configurações do questionário')
    }      
  }

  useEffect(()=>{
    getInfoLesson()
    getQuizSettings()  
  },[])

  return(
    <div className="flex flex-col justify-center items-center">
      { error !== null ? (
        <p className="text-red-500">{error}</p>
      ) : settings === null ? 
        <LoadingBars/> : (
        <div className="flex flex-col w-full h-[100vh] justify-center items-center">
          { settings.show_modules === 1 && <ModulesList courseId={infoLesson.course_id} moduleId={infoLesson.module_id} />}
          <p className="text-white font-bold text-5xl">{settings.home_title_1}</p>
          <p className="text-[#0f0] font-bold text-5xl">{settings.home_title_2}</p>
          <p className="text-white/80 font-light text-xl mt-2">{settings.home_text}</p>
        </div>
      )}
    </div>
  )
}

type ModuleListProps = {
  moduleId:number
  courseId:number
}
const ModulesList = (props:ModuleListProps) => {
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  const getModules = async () => {
    try{
      const m = await api.get(`modulesCourse/${props.courseId}`)
      setModules(m.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{getModules()},[])

  return(
    modules === null ? <Loading/>
    : modules.length == 0 ? (<></>) 
    : modules.map((module,key)=>(
      <div className="bg-green-500 p-4 rounded m-1" key={key}>
        {module.module}
      </div>

    ))
  )
}