import { useEffect, useState } from "react";
import { User } from "../../../../../contexts/Dtos/auth.dto";
import { ChatInput_AdmCommunity } from "./components/ChatInput_AdmCommunity";
import { BodyConversation_AdmCommunity } from "./components/BodyConversation_AdmCommunity";
import { Title_AdmCommunity } from "./components/Title_AdmCommunity";
import { IStudent } from "../../../Students/Dtos/student.dto";
import api from "../../../../../services/api";
import { LoadingBars } from "../../../../../components/Loading";
type Props = {
  userdata:User;
}
export const Chat = (props:Props) => {
  const [update, setUpdate ] = useState(true)
  const [ error, setError ] = useState<null|string>(null)
  const [ studentAccessData, setStudentAccessData ] = useState<IStudent|null|''>(null)
  const getDataStudentAccess = async () => {
    try{
      const info = await api.get(`getDataStudentAccess/${props.userdata.mail}`)
      if(info.data.error){
        setError('Ocorreu um erro ao recuperar a os dados do usuario!')
        console.log(info.data.message)
        return
      }
      setStudentAccessData(info.data.response ? info.data.response : '')
    }catch(err){
      console.log(err)
      setError('Ocorreu um erro ao recuperar a os dados do usuario!')
    }
  }
  useEffect(()=>{getDataStudentAccess()},[])
  return (
    error !== null ? (
      <div className="flex-1 flex flex-col">
        <p className="text-red-500">{error}</p>
      </div>
    ) : studentAccessData === null ? (
      <LoadingBars/>
    ) : studentAccessData === '' ? (
      <div className="flex-1 flex flex-col">
        <p className="text-red-500">É Necessário acesso a area de alunos para enviar mensagens!</p>
      </div>
    ) : (
      <div className="flex-1 flex flex-col">
        <Title_AdmCommunity/>
        <div className="flex justify-start items-center h-full">
          <div className=" h-full rounded-md p-2 flex-col flex flex-1 ">
            <BodyConversation_AdmCommunity
              page={1}
              userdata={studentAccessData}
              setUpdate={setUpdate}
              update={update}/>
            <ChatInput_AdmCommunity 
              userdata={studentAccessData}
              setUpdate={setUpdate} />
          </div>
        </div>
      </div>
    )      
  )
}