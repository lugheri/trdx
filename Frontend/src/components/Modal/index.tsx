import { ModalType,ModalTitleType } from "../Dtos/modal.dto"

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Button } from "../Buttons";

export const Modal:React.FC<ModalType> = (props) => {
  return(    
    <div className="fixed inset-0 flex items-center justify-center z-10 bg-[#000000aa] backdrop-blur-[2px]">
      <div className={`bg-gray-800 p-4 rounded-md shadow-md animate-[modalUp_.5s] max-w-[75%] overflow-x-hidden ${props.className}`}>
        {props.component}
      </div>
        
    </div>
  )
}

export const TitleModal:React.FC<ModalTitleType> = (props) =>{
  return(
    <div className="flex justify-between border-b border-slate-600 pb-2">
      <div className="flex flex-col justify-start items-start">
        <p className="font-semibold text-slate-300">
          <FontAwesomeIcon className="opacity-50 text-teal-500" icon={Fas[props.icon] as IconProp}/> {props.title}
        </p>
        {props.subtitle ? (<p className="text-xs text-teal-300">{props.subtitle}</p>):false}
      </div>
      { props.close ? (<Button className="ml-8" size="sm" title="Fechar" icon="faXmark" btn="muted"  type="notline" onClick={props.close}/>):false}
    </div>
  )
}
