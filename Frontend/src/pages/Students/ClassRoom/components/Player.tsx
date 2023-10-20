import { useState, useEffect } from 'react';

import * as Far from "@fortawesome/free-regular-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAttachmentsLesson, ILessons } from "../../Dtos/courses.dto"
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';
import { CommentsLesson } from './CommentsLesson';
import { urlBase } from '../../../../utils/baseUrl';


interface VideoPlayerProps {
  lesson_id:number,
  module_id:number,
  course_id:number,
  nameCourse:string,
  student_id:number,
  studentName:string,
  setLessonId:React.Dispatch<React.SetStateAction<number>>,
  setOpenNotePad:React.Dispatch<React.SetStateAction<boolean>>,
  setOpenNotePadMobile:React.Dispatch<React.SetStateAction<boolean>>,
  setMobileSide:React.Dispatch<React.SetStateAction<'lesson'|'tools'|'comments'|null>>,
  mobileSide:'lesson'|'tools'|'comments'|null
}

export const Player : React.FC<VideoPlayerProps> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessons | null>(null)
  const [ scoreLesson, setScoreLesson ] = useState<number|null>(null)
  const [ watchedLesson, setWatchedLesson ] = useState<boolean|null>(null)
  const [ attachmentsLesson, setAttachmentsLesson ] = useState<IAttachmentsLesson[]|null>(null)
  useEffect(()=>{
    const getInfoLesson = async () => {
      try{
        const info = await api.get(`infoLesson/${props.lesson_id}`)
        
        setInfoLesson(info.data.response)
      }catch(err){
        console.log(err)
      }      
    }
    const getWatchedLesson = async () => {
      try{
        const watch = await api.get(`getWatchedLesson/${props.student_id}/${props.lesson_id}`)
        setScoreLesson(watch.data.response ? watch.data.response.score : null )
        setWatchedLesson(watch.data.response ? true : false)
      }catch(err){
        console.log(err)
      }  
    }

    const getAttachmentsLesson = async () => {
      try{
        const attachments = await api.get(`getAttachmentsLesson/${props.lesson_id}`)   
        setAttachmentsLesson(attachments.data.response)
      }catch(err){
        console.log(err)
      } 
    }
    getInfoLesson()
    getWatchedLesson()
    getAttachmentsLesson()
  },[props.lesson_id])

  const watchLesson = async () => {
    try{
      setWatchedLesson(true)
      const options = {'viewed':1,
        student_id: props.student_id, 
        course_id: props.course_id,
        module_id: props.module_id,
        lesson_id: props.lesson_id}      
      await api.post(`watchedLesson`,options)
    }catch(e){
      console.log(e)
    }
  }

  const unWatchLesson = async () => {
    try{
      setWatchedLesson(false)
      await api.delete(`watchedLesson/${props.student_id}/${props.lesson_id}`)      
    }catch(e){
      console.log(e)
    }
  }  

  const nextLesson = async () => {
    try{     
      const nextLessons = await api.get(`nextLesson/${props.student_id}/${props.course_id}/${props.lesson_id}`)  
    
      props.setLessonId(nextLessons.data.response['nextLesson'])
    }catch(e){
      console.log(e)
    }
  }

  const [ viewAttachments, setViewAttachments ] = useState(false)
  const openAttachment = async (attachment:IAttachmentsLesson) => {
    const link = attachment.type == 'link' ? attachment.material : `${urlBase}/docs/${attachment.material}`
    window.open(link, '_blank');   
  }

  

  return(
    infoLesson === null ? <Loading/> :  
      <div className="flex flex-col w-full items-start justify-start">
        <iframe 
          className="h-full min-h-[60vh]" 
          width="100%" 
          allow="autoplay; fullscreen" 
          src={`https://player.vimeo.com/video/${infoLesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        
        <div className="flex w-full flex-col mt-2 px-2">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center">           
            <div className="flex flex-col flex-1 mb-4 md:mb-0">
              <p className="text-white font-bold text-xl">{infoLesson.name}</p>
              <p className="text-[#4FFF4E] font-light text-sm">{props.nameCourse}</p>
            </div>
            
            { watchedLesson ? 
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
              : <button
                className="border rounded-md text-xs py-2 px-3 border-neutral-500 text-neutral-500 hover:bg-[#2eff2a] hover:text-black" 
                  onClick={()=>watchLesson()}>
                <FontAwesomeIcon icon={Fas.faCheck}/> Concluir aula
              </button>
              }

          </div>        
          <p className="text-neutral-400 text-xs font-light mt-6">
            <div dangerouslySetInnerHTML={{ __html: infoLesson.description}}/>
          </p>          
        </div>

        {/*Tools Mobile*/}
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

        {/*Tools*/}        
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
          { attachmentsLesson === null ? <p>Carregando anexos</p>
          : attachmentsLesson.length > 0 && (
              viewAttachments ? 
                <div className="flex w-full justify-center items-start px-2 rounded-md bg-[#151515] shadow">
                  <p className="text-neutral-400 h-full hidden md:flex justify-center items-center text-sm font-light">
                    <FontAwesomeIcon icon={Fas.faPaperclip}/> Anexos
                  </p> 
                  <div className="flex flex-wrap justify-center items-center flex-1 h-full">
                    {attachmentsLesson.map((attachment,key)=>
                      <button key={key}
                        className="m-2 max-w-[100%] md:max-w-[33%] border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                        title={attachment.description} 
                        onClick={()=>openAttachment(attachment)}>
                        <FontAwesomeIcon icon={attachment.type === 'arquivo' ? Fas.faDownload : attachment.type === 'link' ? Fas.faArrowUpRightFromSquare : Fas.faQuestionCircle}/> {attachment.name}
                      </button>
                    )}     
                  </div>
                  <button className="rounded-md text-xs mt-2 py-1 px-2 text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                      title="Fechar"  
                      onClick={()=>setViewAttachments(false)}>
                      <FontAwesomeIcon icon={Fas.faTimes}/>
                  </button>
                </div>
              :
                <button
                  className="m-2 border rounded-md text-xs py-2 px-3 border-[#2eff2a] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                    onClick={()=>setViewAttachments(true)}>
                  <FontAwesomeIcon icon={Fas.faPaperclip}/> {attachmentsLesson.length} Anexo(s)
                </button>)
          }          
        </div>

        <div className={`${props.mobileSide == 'comments' ? "flex mt-4" : "hidden" } md:flex w-full`}>       
          <CommentsLesson  course_id={props.course_id} lesson_id={props.lesson_id} module_id={props.module_id} student_id={props.student_id} student_name={props.studentName}/>
        </div>
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
