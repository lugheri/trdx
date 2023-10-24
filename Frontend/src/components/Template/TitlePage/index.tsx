import { TitlePageType } from '../../Dtos/titlepage.dto';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

import { IconProp } from '@fortawesome/fontawesome-svg-core';


export const TitlePage : React.FC<TitlePageType> = (props) => {
  return(
    <div className="flex justify-between items-center">
      <div className="px-4 py-2 text-stone-400">
        <p className="text-3xl flex text-white font-bold">
          { props.icon ? (<FontAwesomeIcon className="m-1" icon={Fas[props.icon] as IconProp}/>) : false}  
          { props.title ? props.title : false }        
        </p>
        { props.description ? (<small className="text-xs font-light">{props.description}</small>): false }      
      </div>
      { props.rightComponent ? props.rightComponent : false } 
    </div>
  )
}