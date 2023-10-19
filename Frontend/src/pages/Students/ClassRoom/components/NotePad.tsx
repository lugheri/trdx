import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, ChangeEvent, FormEvent } from 'react';

type INote = {
  course_id:number,
  nameCourse:string,
  module_id:number,
  lesson_id:number,
  student_id:number,
  setClose:React.Dispatch<React.SetStateAction<boolean>>,  
}

export const NotePad : React.FC<INote> = (props) => {
  const [text, setText] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto'; // Redefinir a altura para automática
    textarea.style.height = textarea.scrollHeight + 'px'; // Definir a altura com base no conteúdo

    setText(e.target.value);
  };

  const sendNote = (e:FormEvent) => {
    e.preventDefault()
  }

  return(
    <div
      className="flex flex-col w-[95%] right-0 h-[95%] absolute rounded-lg overflow-hidden justify-center m-2">
        <div className="bg-[#333333] p-4 flex justify-between">
          <p className="text-[#8CF58A] font-light"><FontAwesomeIcon icon={Fas.faNoteSticky}/> Anotações</p> 
          <button className="text-xs text-neutral-400 font-light hover:text-white" onClick={()=>props.setClose(false)}>Fechar</button>
        </div>
        <div className="bg-[#292929] flex flex-1 p-4">
          <div className="bg-neutral-300 flex flex-col w-full rounded-md shadow-black shadow-md">
            <div className="flex justify-center text-neutral-800 rounded m-1 p-2 text-sm">{props.nameCourse}</div>
            <div className="flex-1 flex"></div>
            <form onSubmit={(e)=>sendNote}className="flex justify-between items-center bg-neutral-500 text-neutral-800 rounded m-1 p-2 text-sm">
              <textarea value={text} required onChange={handleChange} style={{minHeight: '45px',resize: 'none'}}
                    className="font-light focus:ring-0 focus:border-x-0 focus:border-t-0 focus:border-b-white w-full text-sm bg-transparent h-[45px] border-b border-b-neutral-400 text-white placeholder:text-white"
                  placeholder="Escreva aqui sua anotações ..."/>
              <div className="w-50">
                <button type="submit"
                  className="w-[45px] h-[45px] ml-2 rounded-full text-white text-lg bg-gradient-to-r from-[#24ff0055] to-[#2eff2a]">
                  <FontAwesomeIcon icon={Fas.faEdit}/>
                </button>
              </div>
            </form>           
          </div>         
        </div>      
    </div>
  )
}