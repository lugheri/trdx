import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const TextHome = () => {
  return (
    <div className="flex flex-col flex-1">  
      <p className="font-semibold text-stone-400">
        <FontAwesomeIcon className="text-green-600" icon={Fas.faFileText}/> Texto de Home
      </p>
      <div className="flex">
        
      </div>
    </div>
  )
}