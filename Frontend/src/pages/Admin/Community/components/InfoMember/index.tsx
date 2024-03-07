import moment from "moment"
import { Button } from "../../../../../components/Buttons"
import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"
import { IStudent } from "../../../Students/Dtos/student.dto"
import { useEffect, useState } from "react"
import { ICommunityBlockMember } from "../../../../Students/CommunityStudent/Dto/community.dto"
import { LoadingBars } from "../../../../../components/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"
import api from "../../../../../services/api"

type Props = {
  responsibleUser:number,
  infoMember:IStudent|null,
  setInfoMember:React.Dispatch<React.SetStateAction<IStudent|null>>
}
export const InfoMember = (props:Props) => {
  const [ error, setError ] = useState<string|null>(null)
  const [infoBlockMember,setInfoBlockMember] = useState<ICommunityBlockMember|null>(null)
  
  const getInfoBlock = async () => {
    try{
      const i = await api.get(`infoBlockMember/${props.infoMember.id}`)
      if(i.data.error){
        setError(i.data.message)
        return
      }
      setInfoBlockMember(i.data.response ?? [])
      setError(null)
    }catch(err){
      setError(err)
    }
  }

  useEffect(()=>{getInfoBlock()},[props.infoMember])

  //Handle Block
  const handleBlockMember = async (typeBlock:string,param:number) => {
    console.log('handleBlockMember',typeBlock,param)
    try{
      if(infoBlockMember.id){
        const dataEdit = {
          user_block_responsible:props.responsibleUser,
          block_audio_message:typeBlock == 'block_audio_message' ? param : infoBlockMember.block_audio_message,
          block_media_message:typeBlock == 'block_media_message' ? param : infoBlockMember.block_media_message,
          block_message_message:typeBlock == 'block_message_message' ? param : infoBlockMember.block_message_message,
          block_access:typeBlock == 'block_access' ? param : infoBlockMember.block_access,
        }
        console.log('edit',dataEdit)
        const r = await api.patch(`/editBlockMember/${props.infoMember.id}`,dataEdit)
        if(r.data.error){
          setError(r.data.message)
          return
        }
      }else{
        const dataNew = {
          user_block_responsible:props.responsibleUser,
          member_id:props.infoMember.id,
          block_audio_message:typeBlock == 'block_audio_message' ? param : 0,
          block_media_message:typeBlock == 'block_media_message' ? param : 0,
          block_message_message:typeBlock == 'block_message_message' ? param : 0,
          block_access:typeBlock == 'block_access' ? param : 0,
        }
        console.log('new',dataNew)
        const r = await api.post(`/blockingMember/`,dataNew)
        if(r.data.error){
          setError(r.data.message)
          return
        }
      }
    }catch(err){
      setError(err)
    }
    //setInfoBlockMember(null)
    getInfoBlock()
  }
  return(
    <div className="flex flex-col w-1/4 bg-gray-900 mx-1 rounded-xl p-2 justify-center items-center">
      <div className="flex flex-col w-4/5 p-4 justify-center items-center border-b border-b-slate-600">
        <StudentProfilePhoto 
          student_id={props.infoMember.id} 
          photo_id={props.infoMember.photo} 
          autoUpdate={false} 
          class="w-32 h-32 my-1 mx-1 group-hover:hidden"/>
        <p className="text-white font-bold text-lg text-center mt-2"> {props.infoMember.name}</p>
        <p className="text-green-500/80 font-light text-center"> {props.infoMember.mail}</p>
        <p className="text-white/50 text-xs font-light">Membro desde: {moment(props.infoMember.since).format('DD/MM/YYYY')}</p>
      </div>
      <div className="bg-slate-950 p-8 my-2 w-full rounded text-white/50 font-light flex justify-center items-center">
        Midias
      </div>
      { error !== null ? (
        <div className="flex flex-col justify-center items-center mt-4 mb-8 text-red-500">
          <FontAwesomeIcon icon={faExclamationTriangle} className="opacity-50 text-4xl"/>
          <p className="text-center text-sm font-light" title={error}>Ocorreu um erro ao buscar as informações do membro!</p>
        </div>
      ) : infoBlockMember === null ? <LoadingBars/>
      : (
        <div className="flex flex-col justify-center items-center mt-4 mb-8">         
          <Button 
            icon="faMicrophoneAltSlash" 
            name={ infoBlockMember.block_audio_message == 1 ? `Envio de audio bloqueado!` : `Bloquear envios de audios` } 
            title={ infoBlockMember.block_audio_message == 1 ? `Clique para liberar` : `Clique para bloquear` } 
            type={ infoBlockMember.block_audio_message == 1 ? `default` : `notline` } 
            btn="warning"  
            size="sm" 
            block 
            onClick={()=>handleBlockMember('block_audio_message',infoBlockMember.block_audio_message == 1 ? 0 : 1)}/>

          <Button 
            icon="faVideoSlash" 
            name={ infoBlockMember.block_media_message == 1 ? `Envio de imagens bloqueado!` : `Bloquear envios de imagens` } 
            title={ infoBlockMember.block_media_message == 1 ? `Clique para liberar` : `Clique para bloquear` } 
            type={ infoBlockMember.block_media_message == 1 ? `default` : `notline` } 
            btn="warning"  
            size="sm" 
            block 
            onClick={()=>handleBlockMember('block_media_message',infoBlockMember.block_media_message == 1 ? 0 : 1)}/>

          <Button 
            icon="faCommentSlash" 
            name={ infoBlockMember.block_message_message == 1 ? `Envio de mensagens bloqueado!` : `Bloquear envios de mensagens` } 
            title={ infoBlockMember.block_message_message == 1 ? `Clique para liberar` : `Clique para bloquear` } 
            type={ infoBlockMember.block_message_message == 1 ? `default` : `notline` } 
            btn="warning"  
            size="sm" 
            block 
            onClick={()=>handleBlockMember('block_message_message',infoBlockMember.block_message_message == 1 ? 0 : 1)}/>

          <Button 
            icon="faLock" 
            name={ infoBlockMember.block_access == 1 ? `Acesso ao chat bloqueado!` : `Bloquear acesso ao chat` } 
            title={ infoBlockMember.block_access == 1 ? `Clique para liberar` : `Clique para bloquear` } 
            type={ infoBlockMember.block_access == 1 ? `default` : `notline` } 
            btn="error"  
            size="sm" 
            block 
            onClick={()=>handleBlockMember('block_access',infoBlockMember.block_access == 1 ? 0 : 1)}/>
        </div>
      )}
      <Button name="Fechar" btn="muted" type="notline" onClick={()=>props.setInfoMember(null)}/> 
      
    </div>
  )
}