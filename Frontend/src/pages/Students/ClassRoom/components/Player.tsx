import { useState, useEffect } from 'react';

import * as Far from "@fortawesome/free-regular-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ILessons } from "../../Dtos/courses.dto"
import api from '../../../../services/api';
import { Loading } from '../../../../components/Loading';

interface VideoPlayerProps {
  lesson_id:number,
  module_id:number,
  course_id:number,
  student_id:number
}

export const Player : React.FC<VideoPlayerProps> = (props) => {
  const [ infoLesson, setInfoLesson ] = useState<ILessons | null>(null)
  useEffect(()=>{
    const getInfoLesson = async () => {
      try{
        const info = await api.get(`infoLesson/${props.lesson_id}`)
        setInfoLesson(info.data.response)
      }catch(err){
        console.log(err)
      }      
    }
    getInfoLesson()
  },[props.lesson_id])

  const nextLesson = () => {console.log('next')}

  const videoId = '677765230'
  return(
    infoLesson === null ? <Loading/> :  
      <div className="flex flex-col w-full items-start justify-start">
        <iframe 
          className="h-full min-h-[60vh]" 
          width="100%" 
          allow="autoplay; fullscreen" 
          src={`https://player.vimeo.com/video/${infoLesson.link}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
        
        <div className="flex w-full flex-col mt-2 px-2">
          <div className="flex justify-between items-center">
            <p className="text-white font-bold text-xl">{infoLesson.name}</p>
            <div className="flex justify-between items-center">
              <RateButton lesson_id={props.lesson_id} student_id={props.student_id} rate={2}/>
              <button
                className="border w-9 h-9 rounded-full border-[#2eff2a] bg-[#2eff2a22] text-[#2eff2a] hover:bg-[#2eff2a] hover:text-black" 
                  onClick={()=>nextLesson}>
                <FontAwesomeIcon icon={Fas.faChevronRight}/>
              </button>
            </div>
          </div>        
          <p className="text-neutral-400 text-xs font-light">
            <div dangerouslySetInnerHTML={{ __html: infoLesson.description}}/>
          </p>          
        </div>
        
      </div>  
  )
}


const RateButton : React.FC<{lesson_id:number,student_id:number,rate:number}> = (props) => {
  const stars = [1,2,3,4,5];
  const setRate = (rate:number) => { console.log(rate)}

  return(
    <div className="flex mr-4">
      {stars.map((item, key) =>
        <div key={key} onClick={()=>setRate(item)} className="text-sm mr-1 cursor-pointer opacity-80 hover:opacity-100">
          { props.rate >= item ? <FontAwesomeIcon className="text-orange-400" icon={Fas.faStar}/> : 
          <FontAwesomeIcon className="text-neutral-400 hover:text-orange-400" icon={Far.faStar}/>} 
        </div>            
      )}
    </div>
  )
}