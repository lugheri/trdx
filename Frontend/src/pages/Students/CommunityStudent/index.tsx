import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Student } from "../../../contexts/Dtos/auth.dto";
import { LoadingBars } from "../../../components/Loading";
import { CommunityTitleBar } from "./components/CommunityTitleBar";
import { CommunityUserInfo } from "./components/CommunityUserInfo";
import { CommunityConversationBody } from "./components/CommunityConversationBody";
import { CommunityChatInput } from "./components/CommunityChatInput";

export const CommunityStudent = () => {
  const authenticated = useAuth();  
  const userData:Student|null = authenticated ? authenticated.userData : null  
  console.log('User Data',userData)

  const [openUserInfo, setOpenUserInfo ] = useState(false)
  const [update, setUpdate ] = useState(true)
  return(
    userData == null ? (
    <LoadingBars/>
    ) : (
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
    )
  )
}