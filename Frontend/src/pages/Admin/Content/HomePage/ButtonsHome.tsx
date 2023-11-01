import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ButtonsHome = () => {
  return (
    <div className="flex flex-col w-1/4">  
      <p className="font-semibold text-stone-400">
        <FontAwesomeIcon className="text-green-600" icon={Fas.faMouse}/> Botões
      </p>
      <div className="flex">
        
      </div>
    </div>
  )
}