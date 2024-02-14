import { useEffect, useState } from "react"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { ICommunityMessage } from "../../Dto/community.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { CommunityMessageBox } from "../CommunityMessageBox"

type PropsType = {
  userdata:Student,
  update:boolean,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>
}
export const CommunityConversationBody = (props:PropsType) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ lastMessages, setLastMessages ] = useState<null|ICommunityMessage[]>(null)

  const getMessages = async () => {
    try{
      const messages = await api.get('listMessagesCommunity/1')
      if(messages.data.error){
        setError(messages.data.message)
      }else{
        setError(null)
        setLastMessages(messages.data.response)
      }
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao exibir as mensagens')
    }
  }
  useEffect(() => {
    props.update == true ? getMessages() : props.setUpdate(false)
}, [props.update]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      getMessages()
    }, 5000);
    return () => clearInterval(intervalId);
  }, []); 

  return(
    <div className="flex-1 overflow-auto">
      { error ? (
        <p className="text-red-500">{error}</p>
      ) : lastMessages === null ? (
        <LoadingBars/>
      ) : lastMessages.length === 0 ? (
        <p>Vazio</p>
      ) : lastMessages.map((message,key)=>(
            <CommunityMessageBox 
              key={key}
              userdata={props.userdata}
              message={message}/> 
          ))}      
    </div>
  )
}