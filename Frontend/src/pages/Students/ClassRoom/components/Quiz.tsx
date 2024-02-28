import { useEffect, useState } from "react";
import { Student } from "../../../../contexts/Dtos/auth.dto";
import { IOptionQuestionQuiz, IQuestionQuiz, ISettingsQuiz } from "../../../Admin/Content/Dtos/quiz.dto";
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
      <div className="flex flex-col justify-center h-full bg-neutral-950 overflow-auto">
        { props.settings.show_modules === 1 && <ListModules courseId={props.infoLesson.course_id} moduleId={props.infoLesson.module_id}/>}  

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
  const [ options, setOptions ] = useState<IOptionQuestionQuiz[]|null>(null)
  const [ selected, setSelected ] = useState<number|null>(null)

 
  const previousQuestion = async (question:number) => {
    try{
      const q = await api.get(`previousQuestion/${props.quizId}/${question}`)
      if(q.data.success){
        const dataQ : IQuestionQuiz = q.data.response
        console.log('PREVIOUS',dataQ)
        props.setLastQuestionId(dataQ.order == 1 ? 0 : dataQ.id-1)
        return
      }
      setError(q.data.message)
    }catch(err){
      setError('Ocorreu um erro interno')
    }
  }

  const nextQuestion = async () => {
    try{
      const q = await api.get(`nextQuestion/${props.quizId}/${props.lastQuestionId}`)
      console.log('Question',q.data)
      if(q.data.success){
        const dataQ : IQuestionQuiz = q.data.response
        setQuestion(dataQ)
        if(dataQ.type_question === "O"){
          const o = await api.get(`listOptionsQuestion/${dataQ.id}`)
          setOptions(o.data.response)
          return
        }       
        setOptions([])
        return
      }
      setError(q.data.message)
    }catch(err){
      setError('Ocorreu um erro interno')
    }
  }



  useEffect(()=>{nextQuestion()},[props.lastQuestionId])

  return(
    error === null ? (
      <div className="flex flex-col justify-center items-center flex-1">
        { question === '' ? <LoadingBars/> 
        : question === null ? 
        ( 
          <p>Fim</p>
        ):(
          <div className="flex flex-col">
            <p className="text-white text-3xl font-light mb-3">
              {question.order}. {question.question}
            </p>

            { options === null ? <LoadingBars/> 
            : options.length == 0 ? <p className="text-white/50">Sem Opções</p>
            : options.map((option,key)=>(
              <OptionAnswer key={key} option={option} selected={selected} setSelected={setSelected}/>
            ))}

            <div className="flex justify-end items-center my-8">
              { question.order > 1 && 
              (
                <div 
                  className="flex justify-center m-1 items-center text-center cursor-pointer font-light py-3 px-4 text-lg bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-slate-950 shadow-md text-white/80 rounded-md"
                  onClick={()=>previousQuestion(question.id)}>
                  Pergunta Anterior
                </div>
              )}
              <Button name="Proxima Pergunta" disabled={selected ? false : true } size="lg" onClick={()=>props.setLastQuestionId(question.id)}/>
            </div>

          </div>
        )}
      </div>
    ) : (
      <p className="text-red-500">{error}</p>
    )
  )
}

type OptionAnswerProps = {
  option:IOptionQuestionQuiz,
  selected:number|null,
  setSelected:React.Dispatch<React.SetStateAction<number|null>>
}
const OptionAnswer = (props:OptionAnswerProps) => {
  const letters = ['a','b','c','d']

  const AnswerQuestion = () => {
    if(props.selected==null){
      console.log('Respondendo Questao')
    }else{
      console.log('Atualizando resposta da questao')
    }
    props.setSelected(props.option.id)

  }
  
  return(
    <button 
      className="flex justify-start items-center my-4 flex-1 group cursor-pointer opacity-80 hover:opacity-100"
      onClick={AnswerQuestion}>
      <div 
        className={`w-8 h-8 rounded-full mx-2 hover:transition-all duration-500 
                  ${props.option.id === props.selected ? 
                    "bg-green-500 border-white-500 border-4 hover:border-green-500" 
                  : "bg-white border-green-500 border-0 hover:border-4"}`}
        ></div>
      <p className="text-white text-2xl font-light">
        {letters[props.option.order-1]}) {props.option.answer} - ({props.option.id} = {props.selected})
      </p>
    </button>
  )
}

type ListModulesProps = {
  courseId:number,
  moduleId:number
}
const ListModules = (props:ListModulesProps) => {
  const [error, setError ] = useState<string|null>(null)
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  const getModules = async () => {
    try{
      const m = await api.get(`modulesCourse/${props.courseId}`)
      setModules(m.data.response)
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao recuperar as informações do questionário')
    }
  }
  useEffect(()=>{getModules()},[])
  return(
    error !== null ? (
      <p className="text-red-500">{error}</p>
    ) : modules === null ? (
      <Loading/>
    ) : modules.length == 0 ? (
      <></>
    ) : (
      <div className="flex justify-center items-center mx-4 my-8">
        { modules.map((module,key)=>(
            <div 
              key={key} 
              className={`rounded-xl mx-2 p-4 flex justify-center items-center text-sm
                        ${props.moduleId == module.id ? 
                          "bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow-md text-black font-bold" 
                        : "bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-slate-950 shadow-md text-white/80 font-light" }`}>
              {module.module}
            </div>))}
      </div>
    )    
  )
}
