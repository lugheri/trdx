import { useEffect, useState } from "react"
import { ILessonsModule, IModuleCourse } from "../../Dtos/courses.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { Card } from "../../../../../components/Cards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCube } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../../components/Buttons"
import { InputForm } from "../../../../../components/Inputs"
import { QuizQuestionsSetup } from "./components/QuizQuestionsSetup"
import { QuizSettings } from "./components/QuizSettings"
import { QuizAccessRule } from "./components/QuizAccessRule"
import { QuizVisibility } from "./components/QuizVisibility"
import { QuizDelete } from "./components/QuizDelete"

type Props = {
  setLessonSetup:React.Dispatch<React.SetStateAction<number|null>>,
  infoModule:IModuleCourse|null,
  lessonId:number,
  course:string
}
export const QuizSetup = (props:Props) => {
  const [ infoQuiz, setInfoQuiz ] = useState<ILessonsModule|null>(null)
  const [ nameQuiz, setNameQuiz ] = useState("")  
  const [ editVisibility, setEditVisibility ] = useState(false)
  const [ removeQuiz, setRemoveQuiz ] = useState(false)
  //Info
  const getInfo = async () => {
    try{
      const i = await api.get(`infoLesson/${props.lessonId}`)
      setInfoQuiz(i.data.response)
      setNameQuiz(i.data.response.name)      
    }catch(e){ console.log(e) }
  }
  useEffect(()=>{ getInfo() },[editVisibility,removeQuiz]) 
  //Save Name Quiz
  const [ saveNameMessage, setSaveNameMessage ] = useState("")
  const saveNameQuiz = async () => {
    try{
      const r = await api.patch(`editLessonModule/${props.lessonId}`,{name:nameQuiz})
      console.log(r)
      setSaveNameMessage("Título do questionáeio alterado com sucesso!")
      setTimeout(()=>{setSaveNameMessage("")},3000)      
    }catch(e){console.log(e)}
  }


  return(
    infoQuiz === null ? (
      <LoadingBars/>
    ) : (
      <div className="flex flex-col">
        {/*Info Course lesson*/}
        <Card component={
          <div className="flex flex-col w-full">
            <div className="flex justify-between">
              <p className="text-neutral-100">
                <FontAwesomeIcon className="text-teal-500/50" icon={faCube}/> Informações do Curso
              </p>
              <Button icon="faReply" btn="muted" name="Voltar" onClick={()=>props.setLessonSetup(null)}/>
            </div>
            <div className="flex w-full">           
              <div className="flex flex-col w-full justify-center px-4">
                <p className="text-white font-light"><b>Curso: </b>{props.course}</p>
                <p className="text-white font-light"><b>Módulo: </b>{props.infoModule ? props.infoModule.module : ""}</p>
                <p className="text-white font-light"><b>Código da Aula: </b>{props.lessonId}</p>
              </div>     
            </div>
          </div>}/>

        {/*Title Quiz*/}
        <Card component={
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col flex-1">
              <p className="text-teal-500 text-sm text-center">{saveNameMessage}</p>
                <InputForm label="Título do Questionário" value={nameQuiz} onChange={setNameQuiz}/>
              </div>          
              <div  className="mt-3 ml-2">
                <Button  btn="success" type="notline" icon="faFloppyDisk" name="Salvar Título" onClick={()=>saveNameQuiz()}/>
              </div>
            </div>}/>
        
        {/*Setup Quiz*/}  
        <div className="flex w-full">
          <div className="flex flex-col w-3/4">
            {/*Questions*/}
            <Card component={<QuizQuestionsSetup quizId={infoQuiz.id}/>}/>

            {/*Description lesson*/}
            <QuizSettings quizId={infoQuiz.id}/>                      
          </div>

          {/*Side*/}
          <div className="flex flex-col flex-1">
            {/*Access Rules*/}
            <QuizAccessRule 
              infoQuiz={infoQuiz} 
              lessonId={props.lessonId}/> 
            
            {/*Visible*/}
            <QuizVisibility 
              infoQuiz={infoQuiz} 
              editVisibility={editVisibility}
              setEditVisibility={setEditVisibility}/>
            
            {/*Remove Quiz*/}
            <Button 
              btn="error" 
              icon="faTrash" 
              type="notline" 
              name="Excluir Questionário" 
              onClick={()=>setRemoveQuiz(true)}/>
            { removeQuiz && <QuizDelete 
                              close={setRemoveQuiz} 
                              quizId={infoQuiz.id}/>}
          </div>
        </div>
      </div> 
    )
  )
}