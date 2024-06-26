import { useState, useEffect,FormEvent,ChangeEvent, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ICommentLessons, ICourse, ILessons,  ILessonsModule,  IModules } from "../Dtos/courses.dto";
import api from "../../../services/api";
import { Loading } from "../../../components/Loading";
import { Card } from "../../../components/Cards";

import * as Fas from "@fortawesome/free-solid-svg-icons";
import * as Far from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "../../../components/Buttons";
import useAuth from "../../../hooks/useAuth";
import { Student } from "../../../contexts/Dtos/auth.dto";



export const ClassRoom = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null

  const location = useLocation();  
  const params = location.pathname.split('/')[4]
  interface LessonObject {
    courseId: string;
    moduleId: string;
  }
  const base64Decoded: LessonObject[] = JSON.parse(atob(params));
  const courseId = parseInt(base64Decoded[0].courseId,10)
  const moduleId = parseInt(base64Decoded[0].moduleId,10)
  const [ lessonId, setLessonId ] = useState<number>(0)
  const [ moduleOpen, setModuleOpen ] = useState<number>(moduleId)

 useEffect(()=>{
  const nextLesson = async () => {
    try{
      const nl = await api.get(`nextLesson/${userData ? userData.id : 0}/${courseId}`)
      setLessonId(nl.data.response.nextLesson)
      setModuleOpen(nl.data.response.module)
    }catch(e){
      console.log(e)
    }
  }
  if(lessonId === 0) { nextLesson()}
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

  const textAreaElement = useRef<HTMLTextAreaElement>(null);
  const [ comment, setComment ] = useState<string>("")
  const handleTextArea = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setComment(newValue)

    if (newValue.split('').length > 20_000) {
      alert('Mensagem muito longa.')
      return;
    }

    if (!newValue.trim().length) return;

    if (textAreaElement.current) {
      textAreaElement.current.value = '';
      const rows = Math.min(10, newValue.split('\n').length + 1)
      const height=rows*22
      textAreaElement.current.style.height = `${height}px`;
    }
  }; 

  const [reloadComments, setReloadComments] = useState(true)
  const newComment = async (e:FormEvent) => {
    e.preventDefault()
    try{
      await api.post(`newCommentLesson`,{lesson_id:lessonId,student_id:userData ? userData.id : 0,comment:comment})
      setComment("")
      setReloadComments(true)
    }catch(e){
      console.log(e)
    }
  }

  const [ pendingComments, setPendingComments] = useState<null|ICommentLessons[]>(null) 
  useEffect(()=>{
    const getPendingComments = async () => {
      try{
        const pcm = await api.get(`commentsPendingApproval/${lessonId}/${userData ? userData.id : 0}`)
        setPendingComments(pcm.data.response)
        setReloadComments(false)
      }catch(e){
        console.log(e)
      }
    }
    getPendingComments()
  },[reloadComments,lessonId]) 

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }


  return (
    <div className="flex ">
      <div className="flex flex-1 flex-col h-[93vh] overflow-auto">
        { lessonId === 0 ? 
          <Card component={
            <div className="flex flex-col">
              { infoCourse == null ? <Loading/> :
                <div className="flex justify-center item-center p-2">              
                  <div className="flex flex-col justify-center p-4">
                    <p className="text-slate-500 dark:text-slate-100 text-2xl font-bold">{infoCourse.name}</p>
                    <p className="text-slate-500 dark:text-slate-100 text mt-4">{infoCourse.description}</p>
                    <p className="text-slate-500 dark:text-slate-100 mt-4">{infoCourse.author ? `Por: ${infoCourse.author }`: false}</p>
                    <p className="text-slate-500 dark:text-slate-100 text-sm mt-4">{infoCourse.tags ? `Tags: ${infoCourse.tags}` : false}</p>
                   
                    <div className="flex mt-4 items-center h-[18px] bg-slate-500 dark:bg-slate-800 w-full shadow rounded-full overflow-hidden relative">
                      <div className="h-full bg-teal-500 duration-1000 ease-out" style={{width:`${progressCourse}%`}}></div>
                      <p className="absolute w-full left-0 top-0 justify-center text-xs font-bold text-white h-full flex items-center">{progressCourse}% Concluido</p>
                    </div>
                  </div>
                </div>
             } 
          </div>}/> 
        : <Player 
            courseId={courseId}
            moduleId={moduleOpen}
            lessonId={lessonId} 
            userId={userData ? userData.id : 0}/>}

        <div className="flex flex-col py-1 px-4">
          <form onSubmit={newComment} className="bg-neutral-800 flex justify-between items-center rounded p-2">
            <textarea 
              rows={Math.min(10, comment.split('\n').length + 1)}
              placeholder="Escreva o sua pergunta ou comentário" 
              required
              value={comment} 
              onChange={handleTextArea} 
              className="flex-1 min-h-[60px] text-neutral-900  bg-neutral-400 placeholder:text-gray-600 placeholder:font-normal rounded shadow border-none focus:ring-0 resize-none"
              ref={textAreaElement}/>
            <Button icon="faPaperPlane" btn="muted" type="notline" submit/>
          </form>
        </div>


        {/*Pending Comments*/}
        <div className="flex flex-col py-1 px-4">
          { pendingComments === null ? false: pendingComments.length == 0 ? false : 
            pendingComments.map((comment,key)=>
            <div  key={key} className="flex p-2 mb-8">
              <div className="w-[40px] h-[40px] bg-slate-500 flex justify-center items-center rounded-full mr-3">
                <FontAwesomeIcon icon={Fas.faUser}/>
              </div>
              <div className="flex flex-1 flex-col capitalize">
                <p className="text-green-400 font-bold text-xs">
                  {comment.Student ? comment.Student.name : '-'}
                  <b className="text-red-600 mx-1">Comentário Aguardando Aprovação</b>
                  <span className="text-neutral-500 ml-4">{formatDate(comment.date_created)}</span>
                </p>
                <p className="text-slate-100 text-sm">{comment.comment}</p>
                <Answers commentId={comment.id} page={1} />
              </div>
              
            </div>
            
            )
          }
        </div>


        <Comments courseId={courseId} lessonId={lessonId} studentId={userData ? userData.id : 0} page={1}/>
      </div>
      <div className="flex w-1/3 flex-col mr-2 mt-2 relative h-[92vh] overflow-hidden">
        <SideBarCurso
          studentId={userData ? userData.id : 0}
          courseId={courseId}
          moduleOpen={moduleOpen} setModuleOpen={setModuleOpen}
          lessonId={lessonId} setLessonId={setLessonId}/>
        <SideActions/>
      </div>
    </div>
  )
} 

const Comments: React.FC<{courseId:number,lessonId:number,studentId:number,page:number}> = (props) => {
  const [comments, setComments] = useState<null|ICommentLessons[]>(null) 
  useEffect(()=>{
    const getComments = async () => {
      try{
        const cm = await api.get(`lessonsComments/${props.lessonId}/${props.page}`)
        setComments(cm.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getComments()
  },[props.lessonId])  

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }


  return(
    <div className="flex flex-col py-1 px-4">
      { comments === null ? <Loading/> : comments.length == 0 ? <div className="flex flex-col justify-center items-center p-6"><FontAwesomeIcon className="p-2 text-4xl text-neutral-800" icon={Fas.faCommentSlash}/><p className="text-neutral-300">Esta aula ainda não possui comentários!</p></div> : 
        comments.map((comment,key)=>
        <div  key={key} className="flex p-2 mb-8">
          <div className="w-[40px] h-[40px] bg-slate-500 flex justify-center items-center rounded-full mr-3">
            <FontAwesomeIcon icon={Fas.faUser}/>
          </div>
          <div className="flex flex-1 flex-col capitalize">
            <p className="text-green-400 font-bold text-xs">
              {comment.Student ? comment.Student.name : '-'}
              <span className="text-neutral-500 ml-4">{formatDate(comment.date_created)}</span>
            </p>
            <p className="text-slate-100 text-sm">{comment.comment}</p>
            <Answers commentId={comment.id} page={1} />
          </div>
          
        </div>
        
        )
      }
    </div>
  )
}

const Answers: React.FC<{commentId:number,page:number}> = (props) => {
  const [answers, setAnswers] = useState<null|ICommentLessons[]>(null) 
  useEffect(()=>{
    const getAnswers = async () => {
      try{
        const aw = await api.get(`lessonsCommentsAnswers/${props.commentId}/${props.page}`)
        setAnswers(aw.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getAnswers()
  },[props.commentId])  

  const formatDate = (dateString:string) => {
    const date = new Date(dateString);
    
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return(
    <div className="flex flex-col py-1 mt-2">
      { answers === null ? <Loading/> : answers.length == 0 ? false : 
        answers.map((answer,key)=>
        <div key={key} className="flex py-2 mb-6">
          <div className="w-[30px] h-[30px] bg-slate-500 flex justify-center items-center rounded-full mr-2">
            <FontAwesomeIcon icon={Fas.faUser}/>
          </div>
          <div className="flex flex-1 flex-col capitalize">
            <p className="text-teal-400 font-bold text-xs">
              {answer.Student ? answer.Student.name : '-'}
              <span className="text-neutral-500 ml-4">{formatDate(answer.date_created)}</span>
            </p>
            <p className="text-slate-100 text-sm">{answer.comment}</p>  
          </div>          
        </div>        
        )
      }
    </div>
  )
}

const Player: React.FC<{courseId:number,moduleId:number,lessonId:number,userId:number}> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessons|null>(null)
  const [ scoreLesson, setScoreLesson ] = useState<number|null>(null)
  const [ watchedLesson, setWatchedLesson ] = useState<boolean|null>(null)
  useEffect(()=>{
    const getInfoLesson = async () => {
      try{
        const il = await api.get(`infoLesson/${props.lessonId}`)
        setInfoLesson(il.data.response)

        const v = await api.get(`getWatchedLesson/${props.userId}/${props.lessonId}`)
        setScoreLesson(v.data.response ? v.data.response.score : null )
        setWatchedLesson(v.data.response ? true : false)
      }catch(e){
        console.log(e)
      }
    }
    getInfoLesson()
  },[props.lessonId])

  const watchLesson = async () => {
    try{
      setWatchedLesson(true)
      const options = {'viewed':1,
        student_id: props.userId, 
        course_id: props.courseId,
        module_id: props.moduleId,
        lesson_id: props.lessonId}      
      await api.post(`watchedLesson`,options)
    }catch(e){
      console.log(e)
    }
  }

  const unwatchLesson = async () => {
    try{
      setWatchedLesson(false)
      await api.delete(`watchedLesson/${props.userId}/${props.lessonId}`)      
    }catch(e){
      console.log(e)
    }
  }

  return(
    infoLesson === null ? <Loading/> :
      <div className="flex flex-col p-1 w-full items-center">
        <div className="block w-[770px] h-[442px] p-0 overflow-hidden shadow shadow-green-950">
         
          <iframe className="w-full h-full" width="100%" height="200" allow="autoplay; fullscreen" 
            src={`https://player.vimeo.com/video/${infoLesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        </div>
        {/* Controllers */}  
        <div className="flex w-full p-4 justify-between">
          <div className="flex flex-col flex-1 justify-start">
            <p className="text-slate-800 dark:text-white text-lg">{infoLesson.name}</p>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              <div dangerouslySetInnerHTML={{ __html: infoLesson.description}}/>
            </p>
          </div> 
          <div className="flex flex-col items-center">
            { watchedLesson ? 
              <div className="flex flex-col">
                {scoreLesson}              
                <Button name="Assistida" btn="success" size="sm" icon="faCheck" type="outline" onClick={()=>unwatchLesson()}/> 
              </div>
            : <Button name="Concluir Aula" btn="muted" size="sm" icon="faCheck" type="outline" onClick={()=>watchLesson()}/>   }
          </div>
        </div>
      </div>
  ) 
}

const SideBarCurso : React.FC<{studentId:number, courseId:number,moduleOpen:number,setModuleOpen:React.Dispatch<React.SetStateAction<number>>,lessonId:number,setLessonId:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
  const [ modules, setModules ] = useState<IModules[]|null>(null)
  useEffect(()=>{
    const getModules = async () => {
      try{
        const mdl = await api.get(`/modulesMyCourse/${props.courseId}`)
        setModules(mdl.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getModules()
  },[])
  const [ lessonsModule, setLessonsModule ] = useState<ILessons[]|null>(null)
  useEffect(()=>{
    const getLessons = async () => {
      setLessonsModule(null)
      try{
        const lm = await api.get(`/lessonsModule/${props.courseId}/${props.moduleOpen}/${props.studentId}`)
        setLessonsModule(lm.data.response)
      }catch(e){
        console.log(e)
      }
    }
    getLessons()
  },[props.courseId,props.moduleOpen])

  return(
    <div className="flex flex-col min-h-[500px] max-h-[550px] bg-gradient-to-b from-black to-[#070707]  rounded overflow-hidden">
      {
      modules === null ? <Loading/> : 
      modules.length == 0 ? <p>Nenhum modulo ativo</p> :
      modules.map((module,key)=>
        <div 
          style={{maxHeight:`${module.id == props.moduleOpen ? 585-(modules.length*35)+'px' : 'auto' }`}}
          key={key}
          className={`flex flex-col`}>
          
          <div className={`flex border-l-8 border-green-500 justify-start items-center cursor-pointer ${module.id == props.moduleOpen ? `bg-black text-green-400  h-[40px] `:"border-b border-b-neutral-800 h-[35px] text-green-500 opacity-40 bg-slate-800 hover:bg-neutral-950 hover:opacity-80"}`}
               onClick={()=>props.setModuleOpen(module.id == props.moduleOpen ? 0 : module.id)}>
            <p className="font-bold text-sm">
              <FontAwesomeIcon className="ml-6 mr-4 opacity-70" icon={module.id == props.moduleOpen ? Fas.faFolderOpen : Fas.faFolder }/>
              {module.module}
            </p>
          </div>
          
            { module.id != props.moduleOpen ? false :  
              <div 
                className={` overflow-auto`}>
                <div 
                  className={`flex flex-col items-start overflow-hidden`}> 
                  { lessonsModule === null ? <Loading/> : 
                    lessonsModule.length == 0 ? <p className="text-center w-full p-4 text-slate-400">Nenhuma aula localizada</p> : 
                    lessonsModule.map((lesson,key)=>
                      <LessonButton key={key} studentId={props.studentId} lesson={lesson} lessonId={props.lessonId} setLessonId={props.setLessonId}/>
                    )} 
                </div>
              </div>               
            }

        </div>
      )}
    </div>
  )
}
const LessonButton : React.FC<{studentId:number, lesson:ILessonsModule, lessonId:number, setLessonId:React.Dispatch<React.SetStateAction<number>>}> = (props) => {
  

  return(
    <button
      onClick={()=>props.setLessonId(props.lesson.id)} 
      className={`flex hover:opacity-90 bg-neutral-600 border-b border-neutral-500 ${props.lessonId === props.lesson.id ? "text-green-500 opacity-100" : "text-white opacity-50" } w-full pl-2 min-h-[50px] justify-between items-center text-sm p-1`}>
      <p className="text-left max-w-[60%] flex justify-center items-center">
        <FontAwesomeIcon  
          fade={props.lessonId === props.lesson.id ? true : false } 
          className="text-green-400 ml-1 mr-2" 
          icon={props.lesson.LessonsViewed ? Far.faCheckCircle : Fas.faPlay}/>  {props.lesson.name}</p>
        {props.lessonId === props.lesson.id ? 
          <Button name="Assistindo Agora" btn="success"  border="circle" size="sm"/>
        : props.lesson.LessonsViewed ? <Button name="Assistida" btn="success" type="outline" icon="faCheck" border="circle" size="sm"/>
        : <Button name="Assistir a aula" btn="light" type="notline" border="circle" size="sm"/> }
    </button>
  )
}
const SideActions = () => {
  return(
    <div className="flex flex-col items-center bg-[#101010] h-[40px] hover:h-[200px] w-[90%] duration-500 ease-out absolute bottom-0 right-4 rounded-t-xl p-2 shadow">
      <p className="font-bold text-teal-500"><FontAwesomeIcon className="text-green-500" icon={Fas.faTools}/> Ferramentas</p>
      <Button name="Anotações" block btn="success" type="outline"/>
      <Button name="Anexos" block btn="success" type="outline"/>
      <Button name="Questionários" block btn="success" type="outline"/>
    </div>
  )
}
