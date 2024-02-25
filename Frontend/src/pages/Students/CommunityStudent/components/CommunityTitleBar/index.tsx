import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { faEllipsisVertical, faSearch } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import api from "../../../../../services/api"

type PropsType = {
  userdata:Student,
  openUserInfo:React.Dispatch<React.SetStateAction<boolean>>
}

export const CommunityTitleBar = (props:PropsType) => {
  const [ member, setMember ] = useState(0)
  const [ onLine, setOnline ] = useState(0)
  
  const changeStatusOnline = async () => {
    try{
      await api.post('setOnline',{"user_id":props.userdata.id})
    }catch(err){
      console.log(err)
    }
  }

  const getInfoMembers = async () => {
    try{
      const data = await api.get('getInfoMembers')
      setMember(data.data.members)
      setOnline(data.data.onLine)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    const interval = setInterval(() => {
      changeStatusOnline()
      getInfoMembers()
    }, 1500);
    return () => clearInterval(interval);
  },[])
  return(
    <div className="flex bg-neutral-800 rounded-md justify-between items-center p-4 mb-2 h-[10vh]">
      <div className="flex flex-1 justify-start items-center">
        <StudentProfilePhoto 
          student_id={props.userdata.id} 
          photo_id={0} 
          autoUpdate={true} 
          class="w-[50px] h-[50px] my-1 mx-2 group-hover:hidden"/>
        <div className="flex flex-col">
          <p className="text-white">{props.userdata.name}</p>
          <p className="text-sm text-white/50 font-light">On Line</p>
        </div>
      </div>
      <div className="flex-1 flex-col justify-center items-center hidden lg:flex">
        <p className="text-white">Comunidade TraderX</p>
        <p className="text-sm text-white/50 font-light">{member} Members, {onLine} Online</p>
      </div>
      <div className="flex lg:flex-1 justify-end items-center">
        <button className="text text-white/50 hover:text-white mx-2">
          <FontAwesomeIcon icon={faSearch}/>
        </button>
        <button 
          className="text text-white/50 hover:text-white mx-2" 
          onClick={()=>props.openUserInfo(true)}>
          <FontAwesomeIcon icon={faEllipsisVertical}/>
        </button>
      </div>
    </div>  
  )
}