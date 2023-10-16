
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const StudentProfilePhoto : React.FC<{photo_id:number,class:string}> = (props)=> {
  return(
    props.photo_id ? 
      <div className={`${props.class} flex mr-2 justify-center items-center rounded-full text-neutral-800 bg-neutral-600`}>
        <FontAwesomeIcon icon={Fas.faUser}/>
      </div> 
    : 
      <div>
        <div className={`${props.class} rounded-full p-[1px] bg-gradient-to-r from-[#24ff0055] to-[#2eff2a]`}>
          <div className="w-full h-full rounded-full flex justify-center items-center bg-gray-300 text-gray-600">
            <FontAwesomeIcon icon={Fas.faUser}/>
          </div>
        </div>
      </div>
  )
}