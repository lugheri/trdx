import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { ICommunityMessage } from "../../Dto/community.dto"

type PropsType = {
  userdata:Student,
  message:ICommunityMessage
}

export const CommunityMessageBox = (props:PropsType) => {
  return(
    <div className="flex flex-col">
      { props.userdata.id === props.message.user_id ? (
        <MyMessage message={props.message}/>
      ) : (
        <OtherMessage message={props.message}/>
      )}
    </div>
  )
}

type PropsMessageType = {
  message:ICommunityMessage
}

const MyMessage = (props:PropsMessageType) => {
  return(
    <div className="flex flex-1 justify-end ">
      <div className="max-w-1/3 py-1 px-4 flex ">       
        <div className="flex flex-col flex-1 justify-end">
          <div className="bg-teal-700 p-3 text-white text-sm font-light  rounded-md rounded-se-none">
            {props.message.message}
          </div>
        </div> 
      </div>
    </div>
  )
}
const OtherMessage = (props:PropsMessageType) => {
  return(
    <div className="flex flex-1">
      <div className="max-w-1/3 flex ">
        { props.message.user_last_message === props.message.user_id ? (
          <>
            <div className="mx-2 w-10 ">
            </div>
            <div className="flex flex-col flex-1">              
              <div className="bg-neutral-700 p-4 mb-1 text-white text-sm font-light rounded-md rounded-ss-none">
                {props.message.message}
              </div>
            </div> 
          </>
        ) : (
          <>
            <StudentProfilePhoto 
              student_id={props.message.user_id} 
              photo_id={props.message.user_photo} 
              autoUpdate={true} 
              class="w-10 h-10 my-1 mx-2 group-hover:hidden"/>
            <div className="flex flex-col flex-1">
              <p className="text-white/50 text-xs mt-3 mb-1">{props.message.user_name}</p>
              <div className="bg-neutral-700 p-4 mb-1 text-white text-sm font-light rounded-md rounded-ss-none">
                {props.message.message}
              </div>
            </div> 
          </>
        )}               
      </div>
    </div>
  )
}