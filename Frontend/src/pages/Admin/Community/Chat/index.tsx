import { useState } from "react";
import { LoadingBars } from "../../../../components/Loading";
import { User } from "../../../../contexts/Dtos/auth.dto";
import useAuth from "../../../../hooks/useAuth";
import { BodyConversation_AdmCommunity } from "./components/BodyConversation_AdmCommunity";
import { Title_AdmCommunity } from "./components/Title_AdmCommunity";
import { ChatInput_AdmCommunity } from "./components/ChatInput_AdmCommunity";

export const Chat = () => {
  const authenticated = useAuth();
  const userData:User|null = authenticated ? authenticated.userData : null 
  const [update, setUpdate ] = useState(true)

  return (
    userData == null ? (
      <LoadingBars/>
    ) : (
      <div className="mx-4 flex flex-col my-4">
        <Title_AdmCommunity userdata={userData}/>
        <div className="flex justify-start items-center h-[77vh]">
          <div 
            className="bg-neutral-900 h-full rounded-md p-4 flex-col flex flex-1 px-[10rem]">
            <BodyConversation_AdmCommunity
              page={1}
              userdata={userData}
              setUpdate={setUpdate}
              update={update}/>
            <ChatInput_AdmCommunity 
              userdata={userData}
              setUpdate={setUpdate} />
          </div>
        </div>
      </div>      
    )
  )
}