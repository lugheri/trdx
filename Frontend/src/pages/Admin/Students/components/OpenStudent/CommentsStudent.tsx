import { useEffect, useState } from "react";
import { Card } from "../../../../../components/Cards"
import api from "../../../../../services/api";
import { IComments } from "../../../Content/Dtos/comments.dto";
import { IStudent } from "../../Dtos/student.dto"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingBars } from "../../../../../components/Loading";
import { ILessonsModule } from "../../../Content/Dtos/courses.dto";

import moment from 'moment';

type CommentStudentComponent = {
  infoStudent:IStudent
}
export const CommentStudent: React.FC<CommentStudentComponent> = (props) => {
  const [ comments, setComments ] = useState<IComments[]|null>(null)
  const getComments = async () => {
    try{      
      const response = await api.get(`getCommentsStudent/${props.infoStudent.id}`)
      if (response && response.data && response.data.success) {
        setComments(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
  useEffect(()=>{ getComments() },[])
  return(
    <div className="flex">
      <Card className="flex-1" component={
        <div className="flex flex-col w-full">
          <p className="text-neutral-300">
            <FontAwesomeIcon  className="text-green-500" icon={Fas.faComment}/> Comentários recentes
          </p>
          <div className="flex flex-wrap mt-2">
            { comments === null 
            ? 
              <LoadingBars/>
            : 
              comments.length == 0 
              ? 
                <div className="flex flex-col w-full justify-center items-center p-8 text-white">
                  <FontAwesomeIcon className="my-4 text-4xl text-neutral-500/50" icon={Fas.faCommentSlash}/>
                  <p>Este aluno ainda não fez nenhum comentário!</p>
                </div>
              : 
                comments.map((comment,key)=><Comment key={key} comment={comment} infoStudent={props.infoStudent}/>)}
          </div>
        </div>}/>
      {/*Support*/}
     
    </div>
  )
}


const Comment : React.FC<{infoStudent:IStudent,comment:IComments}> = (props) => {   
  const [ infoLesson, setInfoLesson ] = useState<ILessonsModule|null>(null)
 
  const [ answersQuestion, setAnswerQuestion ] = useState<IComments|null>(null) 
  const getAnswers = async () => {
    setAnswerQuestion(null)
    try{      
      const response = await api.get(`getAnswers/${props.comment.id}`)
      if (response && response.data && response.data.success) {
        setAnswerQuestion(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }   
  const getInfoLesson = async () => {
    setInfoLesson(null)
    try{      
      const response = await api.get(`infoLesson/${props.comment.lesson_id}`)
      if (response && response.data && response.data.success) {
        setInfoLesson(response.data.response)
      } 
    }catch(e){ console.log(e) }
  }  
  useEffect(()=>{ 
    getAnswers()
    getInfoLesson()},[props.comment])
 
  const formatDate = (date:string) => {
    return moment(date).format('DD/MM/YY HH:mm');
  }
     
 
  return(
    <div className="flex bg-neutral-800 w-full my-2 rounded">      
      <div className="flex flex-col flex-1 py-4 px-4">
        <p className="text-neutral-300 font-light flex items-center">
          <b>{props.infoStudent.name}</b> 
          <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
          <span>{props.infoStudent.mail}</span>
          <FontAwesomeIcon className="mx-2 text-teal-500 text-[.2rem]" icon={Fas.faCircle}/>
          <p className="text-white text-xs">{formatDate(props.comment.date_created)}</p>
        </p>
        <p className="text-white text font-extralight my-2">{props.comment.comment}</p>
        <div className="flex border-t border-neutral-600 justify-end">
          <p className="py-2 text-neutral-400 text-sm">
            <FontAwesomeIcon className="mx-2 text-teal-500" icon={Fas.faChalkboardTeacher}/> 
            Aula: {infoLesson?.name}
          </p>
        </div>
        { answersQuestion !== null && 
        <div className="bg-neutral-900 p-2 rounded text-white">
          <p className="text-xs font-light"><b>Resposta:</b> {answersQuestion.comment}</p>  
        </div>}
      </div>
    </div>
   )
 }