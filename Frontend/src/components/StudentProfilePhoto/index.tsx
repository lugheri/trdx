
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const StudentProfilePhoto : React.FC<{photo_id:number,class:string}> = (props)=> {
  return(
      props.photo_id ? 
      <div className={`${props.class} flex mr-2 justify-center items-center rounded-full text-neutral-800 bg-neutral-600`}>
        <FontAwesomeIcon icon={Fas.faUser}/>
      </div> : 
      <div className={`${props.class} flex mr-2 justify-center items-center rounded-full text-neutral-700 bg-neutral-500`}>
        <FontAwesomeIcon icon={Fas.faUser}/>
      </div>
  )
}