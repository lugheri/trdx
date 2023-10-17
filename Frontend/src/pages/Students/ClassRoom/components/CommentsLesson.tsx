import { useState, useEffect } from "react"

import { StudentProfilePhoto } from "../../../../components/StudentProfilePhoto"
import { ICommentLessons } from "../../Dtos/courses.dto"
import api from "../../../../services/api"

interface ICommentLesson {
  lesson_id:number,
  module_id:number,
  course_id:number,
  student_id:number,
  student_name:string
}
export const CommentsLesson : React.FC<ICommentLesson> = (props) => {
  const [totalComments, setTotalComments] = useState(0)
  useEffect(()=>{
    const getTotalComments = async () => {
      try{
        const total = await api.get(`totalCommentsLesson/${props.lesson_id}"`)
        setTotalComments(total.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getTotalComments()
  },[props.lesson_id])

  const [comment, setComment ] = useState("")
  const sendComment = async () => {
    try{
      const data = {
        lesson_id:props.lesson_id,
        student_id:props.student_id,
        comment:comment
      }
      const total = await api.post(`newCommentLesson`,data)
      setTotalComments(total.data.response)
      setComment("")
    }catch(err){
      console.log(err)
    }
  }

  return(
    <div className="flex flex-col w-full">
      <div className="flex gap-2 py-3 px-5 items-center bg-[#151515] rounded-md mb-4">
        <p className="text-white text-sm font-light">Comentários {totalComments}</p>        
      </div>

      <div className="flex flex-col gap-2 py-3 px-5 items-center bg-[#151515] rounded-md">
        <div className="flex gap-2 py-4 px-5 items-center bg-[#333333] rounded-md w-full">
            <StudentProfilePhoto photo_id={0} class="w-[40px] h-[40px]"/>
            <div className="flex flex-col w-full">
              <p className="text-neutral-300 text-sm">{props.student_name}</p>
              <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="bg-[#333] max-h-6 focus:max-h-max  p-0 text-sm text-white font-light focus:ring-0 focus:border-white border-x-0 border-t-0" placeholder="Digite o seu comentário..."/>
              {comment != "" &&
               <div className="flex w-full justify-end">
                <button
                  className="m-1 border rounded-md text-xs py-2 px-3 border-white text-white hover:bg-white hover:text-black" 
                    onClick={()=>setComment("")}> Cancelar
                </button>
                <button
                  className="m-1 border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                  onClick={()=>sendComment()} >
                  Enviar
                </button>
              </div>}
            </div>
        </div> 
        <PendingApprovalComments lesson_id={props.lesson_id} student_id={props.student_id} lastComment={comment}/>
        <PageComments 
          course_id={props.course_id} 
          lesson_id={props.lesson_id} 
          module_id={props.module_id} 
          student_id={props.student_id}
          page={1} />   

      </div>      
    </div>
  )
}

interface IPendingApprovalComments {
  lesson_id:number,
  student_id:number,
  lastComment:string
}
const PendingApprovalComments : React.FC<IPendingApprovalComments> = (props) => {
  const [ pendingApprovalComments, setPendingApprovalComments ] = useState<ICommentLessons[] | null>(null)
  useEffect(()=>{
    const getPendingComments = async () => {
      try{
        const pendingComments = await api.get(`/commentsPendingApproval/${props.lesson_id}/${props.student_id}`)
        setPendingApprovalComments(pendingComments.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getPendingComments()
  },[props.lastComment])
  return(
    <>
      { pendingApprovalComments === null ? <> - </> 
      : pendingApprovalComments.length > 0 && 
        pendingApprovalComments.map((comment,key)=>
        <div key={key} className="flex flex-col w-full justify-start items-start gap-2 mb-6">
          <div className="flex gap-2 w-full">
            <div className="flex w-[5%] h-[40px] justify-center items-center">
              <StudentProfilePhoto photo_id={0} class="w-[30px] h-[30px]"/>
            </div>
            <div className="flex flex-col w-[93.5%]">
              <div className="mb-4">
                <p className="text-red-500">Aguardando Aprovação!</p>
                <p className="text-white text-sm">{comment.Student ? comment.Student.name : 'Aluno'}</p>
                <p className="text-white text-xs font-light">{comment.comment}</p>
              </div>                       
            </div>  
          </div>         
        </div>)}
    </>
  )
}

interface IPageComments {
  lesson_id:number,
  module_id:number,
  course_id:number,
  student_id:number,
  page:number
}
const PageComments: React.FC<IPageComments> = (props) => {
  const [ commentsLesson, setCommentsLesson ] = useState<ICommentLessons[] | null>(null)
  useEffect(()=>{
    const getComments = async () => {
      try{
        const listComment = await api.get(`lessonsComments/${props.lesson_id}/${props.page}`)
        setCommentsLesson(listComment.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getComments()
  },[props.lesson_id])

  return(
    <div className="flex flex-col w-full">
      { commentsLesson === null ? <p>Carregando Comentários</p>
      : commentsLesson.length == 0 ? <p>Nenhum comentário</p>
      : commentsLesson.map((comment,key)=>
        <div key={key} className="flex flex-col justify-start items-start gap-2 mb-6">
          <div className="flex gap-2 w-full">
            <div className="flex w-[5%] h-[40px] justify-center items-center">
              <StudentProfilePhoto photo_id={0} class="w-[30px] h-[30px]"/>
            </div>
            <div className="flex flex-col w-[93.5%]">
              <div className="mb-4">
                <p className="text-white text-sm">{comment.Student ? comment.Student.name : 'Aluno'}</p>
                <p className="text-white text-xs font-light">{comment.comment}</p>
              </div>    
              <AnswersComments commentId={comment.id}/>        
            </div>  
          </div>         
        </div>)}
    </div>
  )
}


interface IAnswersComments {
  commentId:number
}
const AnswersComments : React.FC<IAnswersComments> = (props) => {
  const [ commentsAnswers, setCommentsAnswers ] = useState<ICommentLessons[] | null>(null)
  useEffect(()=>{
    const getAnswersComments = async () =>{
      try{
        const answersList = await api.get(`lessonsCommentsAnswers/${props.commentId}/1`)
        setCommentsAnswers(answersList.data.response)
      }catch(err){
        console.log(err)
      }
    }
    getAnswersComments()
  },[])
  return(
    <>
      { commentsAnswers === null ? <p className="text-xs font-light">Carregando Respostas</p>
      : commentsAnswers.length > 0 && 
        commentsAnswers.map((comment,key)=>
          <div key={key} className="flex justify-start items-start gap-2 mb-6">
            <div className="flex w-[5%] h-[40px] justify-center items-center">
              <StudentProfilePhoto photo_id={0} class="w-[30px] h-[30px]"/>
            </div>
            <div className="flex flex-col w-[93.5%]">
              <p className="text-white text-sm">{comment.Student ? comment.Student.name : 'Aluno'}</p>
              <p className="text-white text-xs font-light">{comment.comment}</p>
            </div>  
          </div>
        )}
    </>)
}


