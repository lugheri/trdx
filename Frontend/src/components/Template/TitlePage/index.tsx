import { TitlePageType } from '../../Dtos/titlepage.dto';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

import { IconProp } from '@fortawesome/fontawesome-svg-core';


export const TitlePage : React.FC<TitlePageType> = (props) => {
  return(
    <div className="flex justify-between items-center">
      <div className="px-4 py-2 text-cyan-800 dark:text-slate-400 dark:text-white">
        <p className="text-xl font-bold flex ">
          { props.icon ? (<FontAwesomeIcon className="m-1" icon={Fas[props.icon] as IconProp}/>) : false}  
          { props.title ? props.title : false }        
        </p>
        { props.description ? (<small className="text-sm">{props.description}</small>): false }      
      </div>
      { props.rightComponent ? props.rightComponent : false } 
    </div>
  )


}