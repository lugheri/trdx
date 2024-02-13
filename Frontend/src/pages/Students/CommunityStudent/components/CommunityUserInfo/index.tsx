import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

type PropsType = {
  userdata:Student,
  openUserInfo:React.Dispatch<React.SetStateAction<boolean>>
}

export const CommunityUserInfo = (props:PropsType) => {
  return(
    <div className="bg-neutral-900 h-full w-full lg:w-1/4 rounded-md p-4 lg:ml-2 flex flex-col">
      <div className="flex justify-end items-center text-white/50 hover:text-white text-xl">
        <button onClick={()=>props.openUserInfo(false)}>
          <FontAwesomeIcon icon={faTimes}/>
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <StudentProfilePhoto 
            student_id={props.userdata.id} 
            photo_id={0} 
            autoUpdate={true} 
            class="w-[150px] h-[150px] my-1 mx-2 group-hover:hidden"/>
        <p className="text-white">{props.userdata.name}</p>
        <p className="text-white text-sm font-light">{props.userdata.mail}</p>
      </div>
       
       
    </div>
  )
}