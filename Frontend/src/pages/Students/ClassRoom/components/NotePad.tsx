import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';

type INote = {
  course_id:number,
  nameCourse:string,
  module_id:number,
  lesson_id:number,
  student_id:number,
  setClose:React.Dispatch<React.SetStateAction<boolean>>,  
  setCloseMobile:React.Dispatch<React.SetStateAction<boolean>>,  
}

export const NotePad : React.FC<INote> = (props) => {

  const close = () => {
    console.log('close')
    props.setClose(false)
    props.setCloseMobile(false)
  }

  const [note, setNote] = useState<string>('carregando...');
  useEffect(()=>{
    const getNote = async () => {
      try{
        setNote('')
        const noteStudent = await api.get(`studentsNotes/${props.course_id}/${props.student_id}`)
        setNote(noteStudent.data.response ? noteStudent.data.response : '')
      }catch(err){
        console.log(err)
      }
    }
    getNote()
  },[])

  const saveNote = async () => {
    try{
      await api.post(`editNote`,{ student_id:props.student_id,course_id:props.course_id,note:note})
     }catch(err){
      console.log(err)
    }
  }
  
  return(
    <div
      className="flex flex-col w-[95%] right-0 h-[65%] bottom-0 md:bottom-5 md:h-[95%] absolute rounded-lg overflow-hidden justify-center m-2">
        <div className="bg-[#333333] p-4 flex justify-between">
          <p className="text-[#8CF58A] font-light"><FontAwesomeIcon icon={Fas.faNoteSticky}/> Anotações</p> 
          <button className="text-xs z-20 text-neutral-400 font-light hover:text-white" onClick={()=>close()}>Fechar</button>
        </div>
        <div className="bg-[#292929] flex flex-1 p-4">
          <div className="bg-neutral-300 flex flex-col w-full rounded-md shadow-black shadow-md">
            <div className="flex justify-center text-neutral-800 rounded m-1 p-2 text-sm">
              {props.nameCourse}
            </div>
            <div className="flex-1 flex flex-col items-center px-2 pb-2">
              <textarea value={note} required onChange={(e)=>setNote(e.target.value)}
                onBlur={()=>saveNote()} 
                className="bg-white m-1 rounded h-full resize-none overflow-auto border-none shadow font-light focus:ring-0 focus:border-x-0 focus:border-t-0 focus:border-b-white w-full text-sm bg-transparent h-[45px] border-b border-b-neutral-400 text-neutral-800 placeholder:text-neutral-400"
                  placeholder="Escreva aqui sua anotações ..."/>
            </div>                    
          </div>         
        </div>      
    </div>
  )
}
