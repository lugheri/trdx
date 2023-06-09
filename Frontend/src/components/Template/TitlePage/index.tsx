import { TitlePageType } from '../../Dtos/titlepage.dto';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";

import { IconProp } from '@fortawesome/fontawesome-svg-core';


export const TitlePage : React.FC<TitlePageType> = (props) => {
  return(
    <div className="flex p-2 justify-between items-center">
      <div className="p-4 text-slate-500">
        <p className="text-xl font-bold">
          { props.icon ? (<FontAwesomeIcon className="m-1" icon={Fas[props.icon] as IconProp}/>) : false}  
          { props.title ? props.title : false }        
        </p>
        { props.description ? (<small className="text-sm">{props.description}</small>): false }      
      </div>
      { props.rightComponent ? props.rightComponent : false } 
    </div>
  )


}