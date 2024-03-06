import { useEffect, useState } from "react";
import { IAnswersQuiz, IOptionQuestionQuiz, IQuestionQuiz, IQuizStudentGrade, ISettingsQuiz } from "../../../Admin/Content/Dtos/quiz.dto";
import { ILessons, IModules } from "../../Dtos/courses.dto";
import api from "../../../../services/api";
import { Loading, LoadingBars } from "../../../../components/Loading";
import { Button } from "../../../../components/Buttons";
import { Modal } from "../../../../components/Modal";
import { TextAreaForm } from "../../../../components/Inputs";

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

  const [ infoGradeQuiz, setInfoGradeQuiz ] = useState<IQuizStudentGrade|null|number>(0)

  const [ initQuiz, setInitQuiz ] = useState(false)
  const checkingGrade = async () => {
    try{
      const info = await api.get(`gradeQuizStudent/${props.student_id}/${props.infoLesson.id}`)
      if(info.data.error){
        setError(info.data.message)
        return
      }
      setInfoGradeQuiz(info.data.response)
    }catch(e){
      console.log(e)
      setError('Ocorreu um erro ao checar os dados do questionário')
    }
  }
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
  useEffect(()=>{
    checkingGrade()
    getQuizSettings()
  },[initQuiz])

  return(
    <div className="flex flex-col justify-center items-center w-full h-[80vh] lg:h-[100vh]">
      { error === null ? 
        settings === null ? <Loading/> : (
        <>
          <div className="flex flex-col justify-center items-center">
            <p className="text-white font-black text-2xl lg:text-5xl text-center">{settings.home_title_1}</p>
            <p className="text-[#0f0] font-black text-2xl lg:text-5xl mb-4 text-center">{settings.home_title_2}</p>
          </div>
          {infoGradeQuiz===0 ? (
            <LoadingBars/>
          ) : infoGradeQuiz == null ? (
            <>
              <p className="text-white/80 my-4 font-light text-center">{settings.home_text}</p>
              <Button 
                className='mt-12 py-4 px-4 lg:w-1/3' 
                name="Iniciar Questionário" 
                onClick={()=>setInitQuiz(true)}/>
            </>
          ) : (
            <Button 
              disabled={true}           
              icon="faCheck"
              className='mt-12 py-4 px-4 lg:w-1/3 cursor-default' 
              name="Questionário Concluido!" />
          ) }
        </>
      ) : (
        <p className="text-red-500">{error}</p>
      )}

      { initQuiz && 
        <QuizQuestions 
          studentId={props.student_id} 
          infoLesson={props.infoLesson}
          settings={settings}
          closeQuiz={setInitQuiz}/> }
    </div>
  )
}

type QuizQuestionsProps = {
  studentId:number,
  infoLesson:ILessons,
  settings:ISettingsQuiz,
  closeQuiz:React.Dispatch<React.SetStateAction<boolean>>
}
const QuizQuestions = (props:QuizQuestionsProps) => {
  const [ lastQuestionId, setLastQuestionId] = useState(0)
  const [ endQuiz, setEndQuiz ] = useState(false)
  return(
    <Modal className="max-w-[95%] w-[100vw] h-[80vh] lg:w-[85vw] lg:h-[90vh] mr-0 px-0 py-0 " component={
      <div className="flex flex-col justify-center h-full bg-neutral-950 overflow-auto">
        { props.settings.show_modules === 1 && <ListModules courseId={props.infoLesson.course_id} moduleId={props.infoLesson.module_id}/>}  
        { endQuiz === false && (
          <div className="py-4">
            <p className="text-white font-black text-xl lg:text-3xl text-center">{props.settings.home_title_1}</p>
            <p className="text-[#0f0] font-black text-xl lg:text-3xl mb-2 text-center">{props.settings.home_title_2}</p>
            <p className="text-white/70 my-2 text-sm font-extralight text-center">{props.settings.home_text}</p>
          </div>
        )}

        <Questions 
          quizId={props.infoLesson.id}
          studentId={props.studentId}
          lastQuestionId={lastQuestionId}
          setLastQuestionId={setLastQuestionId}
          settings={props.settings}
          infoLesson={props.infoLesson}
          setEndQuiz={setEndQuiz}
          closeQuiz={props.closeQuiz}/>
      </div>
    }/>
  )
}

type QuestionsProps = { 
  quizId:number,
  studentId:number,
  lastQuestionId:number,
  settings:ISettingsQuiz,
  infoLesson:ILessons,
  setLastQuestionId:React.Dispatch<React.SetStateAction<number>>,
  setEndQuiz:React.Dispatch<React.SetStateAction<boolean>>,
  closeQuiz:React.Dispatch<React.SetStateAction<boolean>>
}
const Questions = (props:QuestionsProps) => {
  console.log("Renderizou Questions")
  const [ error, setError ] = useState<string|null>(null)
  const [ question, setQuestion ] = useState<IQuestionQuiz|null|''>('')
  const [ options, setOptions ] = useState<IOptionQuestionQuiz[]|null>(null)
  const [ selected, setSelected ] = useState<number|null>(null)
 
  const previousQuestion = async (question:number) => {
    try{
      const q = await api.get(`previousQuestion/${props.quizId}/${question}`)
      if(q.data.success){
        const dataQ : IQuestionQuiz = q.data.response       
        props.setLastQuestionId(dataQ.order == 1 ? 0 : dataQ.id-1)
        setSelected(null)
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
      if(q.data.success){
        const dataQ : IQuestionQuiz = q.data.response
        setQuestion(dataQ)
        if(dataQ ===null){
          props.setEndQuiz(true)
          return
        }
        if(dataQ.type_question === "O"){
          const o = await api.get(`listOptionsQuestion/${dataQ.id}`)        
          setOptions(o.data.response)
          setSelected(null)
          return
        }       
        setOptions([])
        return
      }
      setError(q.data.message)
    }catch(err){
      setError('Ocorreu um erro ao buscar a proxima questão!')
    }
  }

  useEffect(()=>{nextQuestion()},[props.lastQuestionId])

  return(
    error === null ? (
      <div className="flex flex-col justify-center items-center flex-1">
        { question === '' ? <LoadingBars/> 
        : question === null ? 
        ( 
          <EndQuiz 
            quizId={props.quizId} 
            studentId={props.studentId} 
            settings={props.settings} 
            infoLesson={props.infoLesson}
            closeQuiz={props.closeQuiz}/>
        ):(
          <div className="flex flex-col w-full justify-center items-center">
            <p className="text-white text-3xl font-light mb-3">
              {question.order}. {question.question}
            </p>

            {/*TYPE QUESTION*/}
            { question.type_question == 'D' ? (              
              <div className="flex flex-col justify-center items-center w-4/5 p-1">
                {/*DISSERTATIVE QUESTION */}
                <TextAnswer
                  question_id={question.id}
                  quizId={props.quizId}
                  setSelected={setSelected}
                  studentId={props.studentId} />
              </div>
            ) : options === null ? <LoadingBars/> 
              : options.length == 0 ? <p className="text-white/50">Sem Opções</p>
              : <div className="flex flex-col justify-start items-start max-w-4/5">
                  { options.map((option,key)=>(
                    <OptionAnswer key={key} 
                      option={option} 
                      selected={selected} setSelected={setSelected} 
                      quizId={props.quizId} 
                      studentId={props.studentId}/>
                  ))}
                </div>
            }
            
            {/*NAVIGATION QUESTIONS */}
            <div className="flex justify-end items-center my-8">
              { question.order > 1 && (
                <div 
                  className="flex justify-center m-1 items-center text-center cursor-pointer font-light py-3 px-4 text-lg bg-gradient-to-r from-neutral-800 to-neutral-900 shadow-slate-950 shadow-md text-white/80 rounded-md"
                  onClick={()=>previousQuestion(question.id)}>
                  Pergunta Anterior
                </div>
              )}
              <Button 
                name="Proxima Pergunta" 
                disabled={selected ? false : true } 
                size="lg" 
                onClick={()=>props.setLastQuestionId(question.id)}/>
            </div>
          </div>
        )}
      </div>
    ) : (
      <p className="text-red-500">{error}</p>
    )
  )
    
}

//ANSWERS COMPONENTS

//DISSERTATIVE ANSWER COMPONENT
type TextAnswerProps = {
  studentId:number,
  quizId:number,
  question_id:number,
  setSelected:React.Dispatch<React.SetStateAction<number|null>>
}
const TextAnswer = (props:TextAnswerProps) => {
  const [ answerId, setAnswerId ] = useState(0)
  const [ answerText, setAnswerText ] = useState('')
  const infoAnswer = async () => {
    try{
      const a = await api.get(`infoAnswerQuestion/${props.question_id}/${props.studentId}`)
      const answer:IAnswersQuiz = a.data.response     
      if(answer){
        console.log('Answer',answer.option_id)
        setAnswerText(answer.answer)
        setAnswerId(answer.id)
      }
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{infoAnswer()},[props.question_id])

  const AnswerQuestion = async () => {
    if(answerId==0){
      {/*Respondendo questao */}
      const data = {
        student_id:props.studentId,
        quiz_id:props.quizId,
        question_id:props.question_id,
        option_id:0,
        answer:answerText,
        correct_answer:0
      }
      console.log('data',data)
      props.setSelected(1)
      const r = await api.post('answerQuestion',data)
      if(r.data.error){
        console.log(r.data.message)
        return        
      }
    }else{
      {/*Atualizando resposta da questao*/}
      const data = {
        student_id:props.studentId,
        quiz_id:props.quizId,
        question_id:props.question_id,
        option_id:0,
        answer:answerText,
        correct_answer:0
      }
      props.setSelected(1)
      const r = await api.patch(`editAnswerQuestion/${props.question_id}/${props.studentId}`,data)
      if(r.data.error){
        console.log(r.data.message)
        return        
      }
    }
  }
  
  return(
    <div className='flex flex-col justify-center items-end w-full'>
      <div className='flex w-full'>
        <TextAreaForm value={answerText} onChange={setAnswerText} placeholder="Digite sua resposta"/>
      </div>
      <Button btn="success" icon="faFloppyDisk" name="Salvar Resposta" onClick={()=>AnswerQuestion()}/>
    </div>
  )
}
//OBJETIVE ANSWER COMPONENT
type OptionAnswerProps = {
  option:IOptionQuestionQuiz,
  selected:number|null,
  setSelected:React.Dispatch<React.SetStateAction<number|null>>,
  studentId:number,
  quizId:number
}
const OptionAnswer = (props:OptionAnswerProps) => {
  const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

  const infoAnswer = async () => {
    try{
      const a = await api.get(`infoAnswerQuestion/${props.option.question_id}/${props.studentId}`)
      const answer:IAnswersQuiz = a.data.response     
      if(answer){
        console.log('Answer',answer.option_id)
        props.setSelected(answer.option_id)
      }

    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{infoAnswer()},[props.option])

  const AnswerQuestion = async () => {
    console.log('AnswerQuestion',props.selected)
    if(props.selected==null){
      {/*Respondendo questao */}
      const data = {
        student_id:props.studentId,
        quiz_id:props.quizId,
        question_id:props.option.question_id,
        option_id:props.option.id,
        answer:'',
        correct_answer:props.option.correct_answer
      }
      console.log('data',data)
      props.setSelected(props.option.id)
      const r = await api.post('answerQuestion',data)
      if(r.data.error){
        console.log(r.data.message)
        return        
      }
    }else{
      {/*Atualizando resposta da questao*/}
      const data = {
        student_id:props.studentId,
        quiz_id:props.quizId,
        question_id:props.option.question_id,
        option_id:props.option.id,
        answer:'',
        correct_answer:props.option.correct_answer
      }
      props.setSelected(props.option.id)
      const r = await api.patch(`editAnswerQuestion/${props.option.question_id}/${props.studentId}`,data)
      if(r.data.error){
        console.log(r.data.message)
        return        
      }
    }
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
        {letters[props.option.order-1]}) {props.option.answer}
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


type EndQuizProps = {
  studentId:number,
  quizId:number,
  settings:ISettingsQuiz,
  infoLesson:ILessons,
  closeQuiz:React.Dispatch<React.SetStateAction<boolean>>
}
const EndQuiz = (props:EndQuizProps) => {
  const [ approved, setApproved ] = useState<boolean|null>(null)
  const [ grade, setGrade ] = useState<number|null>(null)
  const [ error, setError ] = useState<null|string>(null)

  const watchLesson = async () => {
    try{
      const options = {'viewed':1,
        student_id: props.studentId, 
        course_id: props.infoLesson.course_id,
        module_id: props.infoLesson.module_id,
        lesson_id: props.quizId}      
      await api.post(`watchedLesson`,options)
    }catch(e){
      console.log(e)
    }
  }

  const getAverageGrade = async () => {
    setApproved(true)
    try{    
      const a = await api.get(`averageGradeQuizStudent/${props.studentId}/${props.quizId}`)
      if(a.data.error){
        setError(a.data.message)
        return
      }
      setGrade(a.data.response)
      setApproved(a.data.response > props.settings.passing_threshold ? true : false)
    }catch(e){
      console.log(e)
      setError(e)
    }
  }

  const endQuiz = async () => {
    try{    
      const data = {
        student_id:props.studentId,
        quiz_id:props.quizId,
        grade:grade,
        approved:approved === true ? 1 : 0,
        completed:1
      }
      const end = await api.post('endQuiz',data)
      await watchLesson()
      if(end.data.error){
        setError(end.data.message)
        return
      }
      props.closeQuiz(false)
    }catch(e){
      console.log(e)
      setError(e)
    }
  }
  useEffect(()=>{getAverageGrade()},[])
  return(
    <div className="flex flex-col justify-center items-center text-white">   
      { error !==null && (<p className="text-red-500">{error}</p>)}   
      { approved === null ? 
        <LoadingBars/> 
      : approved == true ? (
        <>
          <div className="py-4">
            <p className="text-white font-black text-xl lg:text-3xl text-center">{props.settings.approved_title_1}</p>
            <p className="text-[#0f0] font-black text-xl lg:text-3xl mb-2 text-center">{props.settings.approved_title_2}</p>
            <p className="text-white/70 my-2 text-sm font-extralight text-center">{props.settings.approved_text}</p>
            
          </div>
        </>
      ) : (
        <>
          <div className="py-4">
            <p className="text-white font-black text-xl lg:text-3xl text-center">{props.settings.reproved_title_1}</p>
            <p className="text-[#f00] font-black text-xl lg:text-3xl mb-2 text-center">{props.settings.reproved_title_2}</p>
            <p className="text-white/70 my-2 text-sm font-extralight text-center">{props.settings.reproved_text}</p>
          </div>
        </>
      )}
      <Button className="px-4 py-4" 
        btn="success"
        type="outline"
        name="Concluir Questionário" 
        onClick={()=>endQuiz()}/>
    </div>
  )

}