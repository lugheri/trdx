import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Student } from "../../../contexts/Dtos/auth.dto";
import { LoadingBars } from "../../../components/Loading";
import { CommunityTitleBar } from "./components/CommunityTitleBar";
import { CommunityUserInfo } from "./components/CommunityUserInfo";
import { CommunityConversationBody } from "./components/CommunityConversationBody";
import { CommunityChatInput } from "./components/CommunityChatInput";
import api from "../../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";


export const CommunityStudent = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  
  const [openUserInfo, setOpenUserInfo ] = useState(false)
  const [update, setUpdate ] = useState(true)
  const [ typeAccess, setTypeAccess ] = useState<null | 'community' | 'default'>(null)
  const checkTypeAccess = async () => {
    try{
      const type = await api.get(`checkTypeStudentAccess/${userData ? userData.id : 0}`)
      console.log("Type",type.data.response)
      setTypeAccess(type.data.response['community'] == 1 ? 'community' : 'default')
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{checkTypeAccess()},[])
  return(
    userData == null ? (
    <LoadingBars/>
    ) : typeAccess === "community" ? (
      //Main Community
      <div className="mr-4 ml-4 md:ml-28 lg:ml-28 xl:ml-28 2xl:ml-28 flex flex-col my-4">
        <CommunityTitleBar 
          userdata={userData} 
          openUserInfo={setOpenUserInfo}/>
        
        <div className="flex justify-start items-center h-[75vh] lg:h-[84vh] ">
          <div 
            className={`bg-neutral-900 h-full rounded-md p-4 flex-col ${openUserInfo === true ? "hidden lg:flex lg:flex-1" : "flex flex-1 lg:px-[12rem]" }`}>
            <CommunityConversationBody 
              page={1}
              userdata={userData}
              setUpdate={setUpdate}
              update={update}/>              
            <CommunityChatInput 
              userdata={userData}
              setUpdate={setUpdate} />
          </div>  
          { openUserInfo && <CommunityUserInfo userdata={userData} openUserInfo={setOpenUserInfo}/>}
        </div>
      </div>
    ) : (
      <div className="flex flex-col my-4 justify-center items-center h-full">
        <FontAwesomeIcon className="text-6xl my-4 text-red-500/50" icon={faLock}/>
        <p className="font-black text-4xl text-white ">Acesso Bloqueado</p>
        <p className="font-md text-red-500">Somente os membros da comunidade têm acesso a esta área!</p>

      </div>
    )
  )
}