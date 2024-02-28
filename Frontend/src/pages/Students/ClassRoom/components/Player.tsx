import { useState, useEffect } from 'react';

import * as Far from "@fortawesome/free-regular-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAttachmentsLesson, ILessons } from "../../Dtos/courses.dto"
import api from '../../../../services/api';
import { LoadingBars } from '../../../../components/Loading';
import { CommentsLesson } from './CommentsLesson';
import { urlBase } from '../../../../utils/baseUrl';
import moment from 'moment';
import { QuizStart } from './Quiz';


interface VideoPlayerProps {
  lesson_id:number,
  module_id:number,
  course_id:number,
  nameCourse:string,
  student_id:number,
  studentName:string,
  setLessonId:React.Dispatch<React.SetStateAction<number>>,
  setCheckLesson:React.Dispatch<React.SetStateAction<number|null>>,
  setModuleOpen:React.Dispatch<React.SetStateAction<number>>,
  setOpenNotePad:React.Dispatch<React.SetStateAction<boolean>>,
  setOpenNotePadMobile:React.Dispatch<React.SetStateAction<boolean>>,
  setMobileSide:React.Dispatch<React.SetStateAction<'lesson'|'tools'|'comments'|null>>,
  mobileSide:'lesson'|'tools'|'comments'|null
}

export const Player : React.FC<VideoPlayerProps> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessons | null>(null)  
  const [ validityCourse, setValidityCourse] = useState(null);
  const checkValidity = async () => {
    try{
      const contract = await api.get(`validityCourse/${props.course_id}/${props.student_id}`)
      setValidityCourse(contract.data.response) 
    }catch(e){console.log(e)}
  }
  const getInfoLesson = async () => {
    try{
      const info = await api.get(`infoLesson/${props.lesson_id}`)      
      setInfoLesson(info.data.response)
    }catch(err){
      console.log(err)
    }      
  }  
  useEffect(()=>{    
    getInfoLesson()
    checkValidity()
  },[props.lesson_id])  

  const sendPresence = async () => {
    try{
      const data = {
        studentId:props.student_id,
        course:props.course_id,
        module:props.module_id,
        lesson:props.lesson_id
      }
      await api.post('sendPresence',data) 
    }catch(err){
      console.log(err)
    } 
  }
  const [update,setUpdate] = useState(0)
  useEffect(()=>{
    sendPresence()
    const timer=update+1
    setTimeout(()=>{setUpdate(timer)},30000)
  },[update,props.lesson_id])
  
  

  const [ accessLesson, setAccessLesson ] = useState(null)
  const [ dateAccess, setDateAccess ] = useState("")
  const [ messageAccessLesson, setMessageAccessLesson ] = useState("")
  const getAccessRules = async () => {
    setAccessLesson(null)
    try{
      const response = await api.get(`checkAccessLesson/${props.lesson_id}/${props.student_id}`)
      if(response.data.success){
        setAccessLesson(response.data.response.access)
        setDateAccess(response.data.response.dateAccess)
        setMessageAccessLesson(response.data.response.message ? response.data.response.message : "")
      }
    }catch(err){console.log(err)}
  }
  useEffect(()=>{ getAccessRules() },[props.lesson_id]) 

  return(
    infoLesson === null ? ( <LoadingBars/> )
    : validityCourse == 'not_have' ? ( <BlockingAccess/> )
    : validityCourse == 'expired' ? ( <ExpiredAccess/> ) 
    : (      
      <div className="flex flex-col w-full items-start justify-start ">
        { infoLesson.type_lesson === 'Quiz' ? (
          <QuizStart 
            course_id={props.course_id} infoLesson={infoLesson} module_id={props.module_id} 
            studentName={props.studentName} student_id={props.student_id}/>
        ) : (
          <Lesson 
            accessLesson={accessLesson} infoLesson={infoLesson} dateAccess={dateAccess} messageAccessLesson={messageAccessLesson}
            lesson_id={props.lesson_id} module_id={props.module_id} course_id={props.course_id} nameCourse={props.nameCourse} 
            student_id={props.student_id} studentName={props.studentName} setCheckLesson={props.setCheckLesson} setLessonId={props.setLessonId} 
            setModuleOpen={props.setModuleOpen} setOpenNotePad={props.setOpenNotePad} setOpenNotePadMobile={props.setOpenNotePadMobile} 
            setMobileSide={props.setMobileSide}  mobileSide={props.mobileSide}/>
        )}
      </div>  
    )
  )
}




//Messages Access
const BlockingAccess = () => {
  return(
    <div className="flex flex-col w-full h-full items-center justify-center">
      <FontAwesomeIcon className="text-orange-500/50 text-4xl my-4" icon={Fas.faLock}/>
      <p className="text-neutral-300 text-xl">Acesso Bloqueado</p> 
      <p className="text-neutral-300 text font-light my-2">
        Parece que você não possui acesso a este conteúdo
      </p>  
    </div> 
  )
}
const ExpiredAccess = () => {
  return(
    <div className="flex flex-col w-full h-full items-center justify-center">
      <FontAwesomeIcon className="text-orange-500/50 text-4xl my-4" icon={Fas.faCalendarTimes}/>
      <p className="text-neutral-300 text-xl">Acesso Expirado</p>       
      <p className="text-neutral-300 text font-light my-2">
        Parece que você não possui acesso a este conteúdo
      </p>   
    </div> 
  )
}
type AwaitingReleaseProps = {
  dateAccess:string,
  messageAccessLesson:string
}
const AwaitingRelease = (props:AwaitingReleaseProps) => {
  return(
    <div className="bg-black p-4 rounded w-[98%] min-h-[60vh] flex flex-col justify-center items-center">
      <FontAwesomeIcon className="text-teal-500 text-4xl" icon={Fas.faLock}/>
      <p className="text-neutral-500 text-lg mt-3">Espere só mais um pouco!</p>  
      <p className="text-neutral-500 mb-3">
        Esta aula estará disponível a partir de {moment(props.dateAccess).format('DD/MM/YYYY')}
      </p>  
      <p className="text-neutral-500 text-xs">{props.messageAccessLesson}</p>  
    </div>
  )
}

//LessonComponent
type LessonProps = {
  accessLesson:boolean|null,
  infoLesson:ILessons,
  dateAccess:string,
  messageAccessLesson:string,
  lesson_id:number,
  module_id:number,
  course_id:number,
  nameCourse:string,
  student_id:number,
  studentName:string,
  setCheckLesson:React.Dispatch<React.SetStateAction<number|null>>,
  setLessonId:React.Dispatch<React.SetStateAction<number>>,
  setModuleOpen:React.Dispatch<React.SetStateAction<number>>,
  setOpenNotePad:React.Dispatch<React.SetStateAction<boolean>>,
  setOpenNotePadMobile:React.Dispatch<React.SetStateAction<boolean>>,
  setMobileSide:React.Dispatch<React.SetStateAction<'lesson'|'tools'|'comments'|null>>,
  mobileSide:'lesson'|'tools'|'comments'|null
}
const Lesson = (props:LessonProps) => {
  const [ watchedLesson, setWatchedLesson ] = useState<boolean|null>(null)  
  const watchLesson = async () => {
    try{
      setWatchedLesson(true)
      props.setCheckLesson(null)
      const options = {'viewed':1,
        student_id: props.student_id, 
        course_id: props.course_id,
        module_id: props.module_id,
        lesson_id: props.lesson_id}      
      await api.post(`watchedLesson`,options)
      props.setCheckLesson(props.lesson_id)
    }catch(e){
      console.log(e)
    }
  }
  const unWatchLesson = async () => {
    try{
      props.setCheckLesson(null)
      setWatchedLesson(false)
      await api.delete(`watchedLesson/${props.course_id}/${props.module_id}/${props.student_id}/${props.lesson_id}`)      
      props.setCheckLesson(0)
    }catch(e){
      console.log(e)
    }
  }  
  const nextLesson = async () => {
    try{     
      const nextLessons = await api.get(`nextLesson/${props.student_id}/${props.course_id}/${props.lesson_id}`)  
      props.setModuleOpen(nextLessons.data.response['module'])
      props.setLessonId(nextLessons.data.response['nextLesson'] == 0 ? nextLessons.data.response['lastLesson'] : nextLessons.data.response['nextLesson'])
    }catch(e){
      console.log(e)
    }
  } 
  const [ scoreLesson, setScoreLesson ] = useState<number|null>(null)
  const getWatchedLesson = async () => {
    try{
      const watch = await api.get(`getWatchedLesson/${props.student_id}/${props.lesson_id}`)
      setScoreLesson(watch.data.response ? watch.data.response.score : null )
      setWatchedLesson(watch.data.response ? true : false)
    }catch(err){
      console.log(err)
    }  
  }    
  useEffect(()=>{  getWatchedLesson() },[props.lesson_id])

  return(
    <div className="flex flex-col w-full items-start justify-start">
      { props.accessLesson === null ? ( <LoadingBars/> )
      : props.accessLesson === true ? (
        <iframe 
          className="h-full min-h-[60vh]" 
          width="100%" 
          allow="autoplay; fullscreen" 
          src={`https://player.vimeo.com/video/${props.infoLesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
      ) : ( <AwaitingRelease dateAccess={props.dateAccess} messageAccessLesson={props.messageAccessLesson}/>)}  
      <div className="flex w-full flex-col mt-2 px-2">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center">           
          <div className="flex flex-col flex-1 mb-4 md:mb-0">
            <p className="text-white font-bold text-xl">{props.infoLesson.name}</p>
            <p className="text-[#4FFF4E] font-light text-sm">{props.nameCourse}</p>
          </div>
          { watchedLesson ? (
            <div className="flex justify-between items-center">
              <RatingButton
                lesson_id={props.lesson_id} 
                student_id={props.student_id} 
                rate={scoreLesson === null ? 0 : scoreLesson}/>
              <button
                className="border w-9 h-9 mr-2 rounded-full border-[#2eff2a] bg-[#2eff2a22] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                onClick={()=>unWatchLesson()}>
                <FontAwesomeIcon icon={Fas.faCheck}/>
              </button>
              <button
                className="border w-9 h-9 rounded-full border-[#2eff2a] bg-[#2eff2a22] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                onClick={()=>nextLesson()}>
                <FontAwesomeIcon icon={Fas.faChevronRight}/>
              </button>
            </div>
          ) : ( 
            <button
              className="border rounded-md text-xs py-2 px-3 border-neutral-500 text-neutral-500 hover:bg-[#2eff2a] hover:text-black" 
              onClick={()=>watchLesson()}>
              <FontAwesomeIcon icon={Fas.faCheck}/> Concluir aula
            </button>
          )}
        </div>  
        <div className="text-neutral-400 text-xs font-light mt-6">
          <p dangerouslySetInnerHTML={{ __html: props.infoLesson.description}}/>
        </div>          
      </div>
      
      <ToolsMobile mobileSide={props.mobileSide} setMobileSide={props.setMobileSide}/>
      <Tools 
        lesson_id={props.lesson_id} 
        mobileSide={props.mobileSide} setMobileSide={props.setMobileSide} 
        setOpenNotePad={props.setOpenNotePad} setOpenNotePadMobile={props.setOpenNotePadMobile}/>

      <div className={`${props.mobileSide == 'comments' ? "flex mt-4" : "hidden" } md:flex w-full`}>       
        <CommentsLesson  
          course_id={props.course_id} 
          lesson_id={props.lesson_id} 
          module_id={props.module_id} 
          student_id={props.student_id} 
          student_name={props.studentName}/>
      </div>
    </div>  
  )
}

//Tools
type ToolsMProps = {
  setMobileSide:React.Dispatch<React.SetStateAction<'lesson'|'tools'|'comments'|null>>,
  mobileSide:'lesson'|'tools'|'comments'|null
}  
const ToolsMobile = (props:ToolsMProps) => {
  return(
    <div className="flex justify-center w-full md:hidden py-2 my-2 border-b border-b-neutral-600">
      <button
        className={`${props.mobileSide == 'lesson' ? " bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow text-black" : "text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" } m-2 border border-[#2eff2a]  rounded-md text-sm py-2 px-3`}
        onClick={()=>props.setMobileSide('lesson')}>
        Aulas
      </button>
      <button
        className={`${props.mobileSide == 'tools' ? " bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow text-black" : "text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" } m-2 border border-[#2eff2a]  rounded-md text-sm py-2 px-3`} 
        onClick={()=>props.setMobileSide('tools')}>
        Conteúdos
      </button>
      <button
        className={`${props.mobileSide == 'comments' ? " bg-gradient-to-r from-[#88ff8c] to-[#2eff2a] shadow-[#24ff0055] shadow text-black" : "text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" } m-2 border border-[#2eff2a]  rounded-md text-sm py-2 px-3`} 
        onClick={()=>props.setMobileSide('comments')}>
        Comentários
      </button>
    </div>
  )
}

type ToolsProps = {
  lesson_id:number,
  setOpenNotePad:React.Dispatch<React.SetStateAction<boolean>>,
  setOpenNotePadMobile:React.Dispatch<React.SetStateAction<boolean>>,
  setMobileSide:React.Dispatch<React.SetStateAction<'lesson'|'tools'|'comments'|null>>,
  mobileSide:'lesson'|'tools'|'comments'|null, 
}  
const Tools = (props:ToolsProps) => {
  const [ attachmentsLesson, setAttachmentsLesson ] = useState<IAttachmentsLesson[]|null>(null)
  const [ viewAttachments, setViewAttachments ] = useState(false)

  const getAttachmentsLesson = async () => {
    try{
      const attachments = await api.get(`getAttachmentsLesson/${props.lesson_id}`)   
      setAttachmentsLesson(attachments.data.response)
    }catch(err){
      console.log(err)
    } 
  }

  useEffect(()=>{ getAttachmentsLesson()},[props.lesson_id])

  const openAttachment = async (attachment:IAttachmentsLesson) => {
    const link = attachment.type == 'link' ? attachment.material : `${urlBase}/docs/${attachment.material}`
    window.open(link, '_blank');   
  }

  return(
    <div className={`${props.mobileSide == 'tools' ? "flex" : "hidden" } mb-6 w-full md:flex`}>
      <button
        className="hidden md:inline m-2 border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
        onClick={()=>props.setOpenNotePad(true)}>
        <FontAwesomeIcon icon={Fas.faNoteSticky}/> Anotações
      </button>
      <button
        className="relative md:hidden m-2 border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
        onClick={()=>props.setOpenNotePadMobile(true)}>
        <FontAwesomeIcon icon={Fas.faNoteSticky}/> Anotações
      </button>
      { attachmentsLesson === null ? 
      (
        <p>Carregando anexos</p>
      ) : (
        attachmentsLesson.length > 0 && 
        (
          viewAttachments ? 
          (
            <div 
              className="flex w-full justify-center items-start px-2 rounded-md bg-[#151515] shadow">
              <p 
                className="text-neutral-400 h-full hidden md:flex justify-center items-center text-sm font-light">
                <FontAwesomeIcon icon={Fas.faPaperclip}/> Anexos
              </p> 
              <div className="flex flex-wrap justify-center items-center flex-1 h-full">
                {attachmentsLesson.map((attachment,key)=>
                  (
                    <button key={key}
                      className="m-2 max-w-[100%] md:max-w-[33%] border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                      title={attachment.description} 
                      onClick={()=>openAttachment(attachment)}>
                      <FontAwesomeIcon icon={attachment.type === 'arquivo' ? Fas.faDownload : attachment.type === 'link' ? Fas.faArrowUpRightFromSquare : Fas.faQuestionCircle}/> {attachment.name}
                    </button>
                  )
                )}     
              </div>
              <button className="rounded-md text-xs mt-2 py-1 px-2 text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                title="Fechar"  
                onClick={()=>setViewAttachments(false)}>
                <FontAwesomeIcon icon={Fas.faTimes}/>
              </button>
            </div>
          ):(
            <button
              className="m-2 border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
              onClick={()=>setViewAttachments(true)}>
              <FontAwesomeIcon icon={Fas.faPaperclip}/> {attachmentsLesson.length} Anexo(s)
            </button>
          )
        )
      )}          
    </div>
  )
}


const RatingButton : React.FC<{lesson_id:number,student_id:number,rate:number}> = (props) => {
  const stars = [1,2,3,4,5];
  const [ rateLesson, setRateLesson ] = useState(props.rate)
  const setRate = async (rate:number) => { 
    try{
      const d = await api.patch(`ratingLesson/${props.student_id}/${props.lesson_id}`,{score:rate}) 
      console.log(`ratingLesson/${props.student_id}/${props.lesson_id}`,d) 
      setRateLesson(rate)
    }catch(err){
      console.log(err)
    }
  }
  const [ starSelect, setStarSelect ] = useState(0)
  return(
    <div className="flex mr-4">
      {stars.map((item, key) =>
        <div key={key} onClick={()=>setRate(item)} onMouseEnter={()=>setStarSelect(item)} onMouseLeave={()=>setStarSelect(0)} className="text-sm mr-1 cursor-pointer opacity-80 hover:opacity-100">
          { rateLesson >= item ? <FontAwesomeIcon className="text-orange-400" icon={Fas.faStar}/> : 
          <FontAwesomeIcon className={`${starSelect >= item ? "text-orange-400": "text-neutral-400 hover:text-orange-400"}`} icon={Far.faStar}/>} 
        </div>            
      )}
    </div>
  )
}




