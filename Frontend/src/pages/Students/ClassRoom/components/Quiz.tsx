import { useEffect, useState } from "react";
import { Student } from "../../../../contexts/Dtos/auth.dto";
import { IQuestionQuiz, ISettingsQuiz } from "../../../Admin/Content/Dtos/quiz.dto";
import { ILessons, IModules } from "../../Dtos/courses.dto";
import api from "../../../../services/api";
import { Loading, LoadingBars } from "../../../../components/Loading";
import { Button } from "../../../../components/Buttons";
import { Modal } from "../../../../components/Modal";

type Props = {
  infoLesson:ILessons,
  student_id:number,
  course_id:number,
  module_id:number,
  studentName:string,
} 
export const QuizStart = (props:Props) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ settings, setSettings ] = useState<ISettingsQuiz|null>(null)

  const [ initQuiz, setInitQuiz ] = useState(false)
  const getQuizSettings = async () => {
    try{
      const infoSett = await api.get(`infoSettingsQuestion/${props.infoLesson.id}`)
      if(infoSett.data.success){ 
        setSettings(infoSett.data.response)
        return
      }
      setError('Ocorreu um erro interno')
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao recuperar as configurações do questionário')
    }      
  }
  useEffect(()=>{getQuizSettings()},[])

  return(
    <div className="flex flex-col justify-center items-center w-full h-[80vh] lg:h-[100vh]">
      { error === null ? 
        settings === null ? <Loading/> : (
        <>
        <div className="flex flex-col justify-center items-center">
          <p className="text-white font-black text-2xl lg:text-5xl text-center">{settings.home_title_1}</p>
          <p className="text-[#0f0] font-black text-2xl lg:text-5xl mb-4 text-center">{settings.home_title_2}</p>
          <p className="text-white/80 my-4 font-light text-center">{settings.home_text}</p>

        </div>
        
        <Button 
          className='mt-12 py-4 px-4 lg:w-1/3' 
          name="Iniciar Questionário" 
          onClick={()=>setInitQuiz(true)}/>
        </>
      ) : (
        <p className="text-red-500">{error}</p>
      )}

      { initQuiz && 
        <QuizQuestions 
          studentId={props.student_id} 
          infoLesson={props.infoLesson}
          settings={settings}/> }
    </div>
  )
}

type QuizQuestionsProps = {
  studentId:number,
  infoLesson:ILessons,
  settings:ISettingsQuiz,
}
const QuizQuestions = (props:QuizQuestionsProps) => {
  const [ lastQuestionId, setLastQuestionId] = useState(0)
  return(
    <Modal className="max-w-[95%] w-[100vw] h-[80vh] lg:w-[85vw] lg:h-[90vh] mr-0 px-0 py-0 " component={
      <div className="flex flex-col justify-center h-full bg-neutral-950">
        <div className="py-4">
          <p className="text-white font-black text-xl lg:text-3xl text-center">{props.settings.home_title_1}</p>
          <p className="text-[#0f0] font-black text-xl lg:text-3xl mb-2 text-center">{props.settings.home_title_2}</p>
          <p className="text-white/70 my-2 text-sm font-extralight text-center">{props.settings.home_text}</p>
        </div>
        <Questions 
          quizId={props.infoLesson.id}
          lastQuestionId={lastQuestionId}
          setLastQuestionId={setLastQuestionId}/>
      </div>
    }/>
  )
}

type QuestionsProps = { 
  quizId:number,
  lastQuestionId:number;
  setLastQuestionId:React.Dispatch<React.SetStateAction<number>>
}
const Questions = (props:QuestionsProps) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ question, setQuestion ] = useState<IQuestionQuiz|null|''>('')
  const nextQuestion = async () => {
    try{
      const q = await api.get(`nextQuestion/${props.quizId}/${props.lastQuestionId}`)
      console.log('Question',q.data)
      if(q.data.success){
        setQuestion(q.data.response)
        return
      }
      setError(q.data.message)
    }catch(err){
      setError('Ocorreu um erro interno')
    }
  }
  useEffect(()=>{nextQuestion()},[])
  return(
    error === null ? (
      <div className="flex flex-col justify-center items-center flex-1">
        { question === '' ? <LoadingBars/> 
        : question === null ? 
        ( 
          <p>Fim</p>
        ):(
          <div className="flex flex-col">
            <p className="text-white">{question.question}</p>
          </div>
        )}
      </div>
    ) : (
      <p className="text-red-500">{error}</p>
    )
  )

}

/*
export const QuizOld = (props:Props) => {
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
}*/
