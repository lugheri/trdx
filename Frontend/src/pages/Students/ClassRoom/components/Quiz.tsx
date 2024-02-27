import { useEffect, useState } from "react";
import { Student } from "../../../../contexts/Dtos/auth.dto";
import { ISettingsQuiz } from "../../../Admin/Content/Dtos/quiz.dto";
import { ILessons } from "../../Dtos/courses.dto";
import api from "../../../../services/api";
import { LoadingBars } from "../../../../components/Loading";

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
      info.data.success ? 
        setSettings(info.data.response)
      : setError('Ocorreu um erro interno')
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
      ):(
        <>
          <p className="text-white">Quiz : {props.lessonId}</p>
          { settings === null ? <LoadingBars/> : (
            <div className="flex flex-col">
              <p className="text-white font-bold">{settings.home_title_1}</p>
              <p className="text-green-500 font-bold">{settings.home_title_2}</p>
              <p className="text-white/80 font-light">{settings.home_text}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}