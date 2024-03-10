import { useEffect, useRef, useState } from "react"
import { StudentProfilePhoto } from "../../../../../../components/StudentProfilePhoto"
import { ICommunityMedia, ICommunityMessage } from "../../../../../Students/CommunityStudent/Dto/community.dto"
import api from "../../../../../../services/api"
import { LoadingBars } from "../../../../../../components/Loading"
import { urlBase } from "../../../../../../utils/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  faChevronDown, faFile } from "@fortawesome/free-solid-svg-icons"
import { Button } from "../../../../../../components/Buttons"
import { IStudent } from "../../../../Students/Dtos/student.dto"
import { Modal, TitleModal } from "../../../../../../components/Modal"
import { ChatInput_AdmCommunity } from "./ChatInput_AdmCommunity"
import moment from "moment"

type PropsType = {
  userdata:IStudent,
  message:ICommunityMessage,
  editMessage:ICommunityMessage,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>,
  setEditMessage:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>,
}
export const MessageBox_AdmCommunity = (props:PropsType) => {  
  const [ answerMessage, setAnswerMessage ] = useState<ICommunityMessage|null>(null)
  const [ editMessage, setEditMessage ] = useState<ICommunityMessage|null>(null)
  const [ removeMessage, setRemoveMessage ] = useState<ICommunityMessage|null>(null)

  const handleCloseEdit = () => {
    props.editMessage && props.setEditMessage(null)
  }
  return(
    <div className={`flex flex-col  ${props.message.public == 0 && "opacity-30"}`} onClick={()=>handleCloseEdit()}>
      { props.userdata.id === props.message.user_id ? (
        <div className="flex flex-1 justify-end group relative">
          <button 
            className="bg-teal-700 hover:bg-teal-800 text-white shadow-md  flex justify-center items-center 
                      group-hover:opacity-100 opacity-0 cursor-pointer w-6 h-6 rounded-full right-4 top-1 absolute"
            onClick={()=>props.setEditMessage(props.message)}>
            <FontAwesomeIcon icon={faChevronDown}/>
          </button>
          
          <MyMessage message={props.message}/>
          { props.editMessage && props.editMessage.id == props.message.id && 
            <ActionsMessage 
              userId={props.userdata.id} dataMessage={props.editMessage}
              setAnswerMessage={setAnswerMessage}
              setEditMessage={setEditMessage}
              setRemoveMessage={setRemoveMessage}/>}
        </div>
      ) : (
        <div className="flex flex-1 group relative">
          <button 
            onClick={()=>props.setEditMessage(props.message)}
            className="bg-neutral-700 hover:bg-neutral-800 text-white shadow-md flex justify-center items-center 
                        group-hover:opacity-100 opacity-0 cursor-pointer w-6 h-6 rounded-full left-14 top-1 absolute">
            <FontAwesomeIcon icon={faChevronDown}/>
          </button>
          <OtherMessage message={props.message}/>
          { props.editMessage && props.editMessage.id == props.message.id && 
            <ActionsMessage 
              userId={props.userdata.id} dataMessage={props.editMessage}
              setAnswerMessage={setAnswerMessage}
              setEditMessage={setEditMessage}
              setRemoveMessage={setRemoveMessage}/>}
        </div>
      )}

      { answerMessage && <AnswerMessage messageData={answerMessage} close={setAnswerMessage} />}
      { editMessage && <EditMessage messageData={editMessage} close={setEditMessage} userdata={props.userdata} setUpdate={props.setUpdate} />}
      { removeMessage && <RemoveMessage messageData={removeMessage} close={setRemoveMessage} />}
    </div>
  )
}

type PropsMessageType = {
  message:ICommunityMessage
}
const MyMessage = (props:PropsMessageType) => {  
  return(
    <div className="py-1 px-4 flex">       
      <div className="flex flex-col flex-1 justify-end">
        <div className={`bg-teal-700  shadow shadow-neutral-950/50 text-white                       
                        max-w-[250px] lg:max-w-[500px]  text-sm font-light  rounded-md rounded-se-none`}>
          { props.message.media === 0 ? (
            <div className="m-3" dangerouslySetInnerHTML={{ __html: props.message.message }} />
          ) : (
            <LoadMedia mediaId={props.message.media}  message={props.message.message}  />
          )}
          <p className="text-xs text-white/80 float-right mx-1">{moment(props.message.date_created).format('DD/MM HH:mm')}</p>
        </div>
      </div> 
    </div>
  )
}
const OtherMessage = (props:PropsMessageType) => {
  return(
    <div className="flex overflow-hidden">
      { props.message.user_last_message === props.message.user_id ? (
        <>
          <div className="mx-2 w-10 ">
          </div>
          <div className="flex flex-col flex-1">              
            <div className="bg-neutral-700 max-w-[200px] lg:max-w-[500px] mb-1 text-white text-sm font-light shadow shadow-neutral-950/50 rounded-md rounded-ss-none">
              { props.message.media === 0 ? (
                <div className="m-3" dangerouslySetInnerHTML={{ __html: props.message.message }} />
              ) : (
                <LoadMedia mediaId={props.message.media} message={props.message.message} />
              )}
              <p className="text-xs text-white/80 float-right mx-1">{moment(props.message.date_created).format('HH:mm')}</p>
            </div>
          </div> 
        </>
      ) : (
        <>
          <StudentProfilePhoto 
            student_id={props.message.user_id} 
            photo_id={props.message.user_photo} 
            autoUpdate={true} 
            class="w-10 h-10 my-1 mx-2"/>
          <div className="flex flex-col flex-1">
            <p className="text-white/50 text-xs mt-3 mb-1">{props.message.user_name}</p>
            <div className="bg-neutral-700 max-w-[200px] lg:max-w-[500px] mb-1 text-white text-sm font-light rounded-md rounded-ss-none shadow shadow-neutral-950/50">
              { props.message.media === 0 ? (
                <div className="m-3" dangerouslySetInnerHTML={{ __html: props.message.message }} />
              ) : (
                <LoadMedia mediaId={props.message.media} message={props.message.message} />
              )}
              <p className="text-xs text-white/80 float-right mx-1">{moment(props.message.date_created).format('HH:mm')}</p>
            </div>
          </div> 
        </>
      )}               
    </div>
  )
}

type ActionsMessageProps = {
  userId:number;
  dataMessage:ICommunityMessage,
  setAnswerMessage:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>,
  setEditMessage:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>,
  setRemoveMessage:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>
}
const ActionsMessage = (props:ActionsMessageProps) => { 
  const reexibirMessage = async () => {
    try{
      const data = {
        public:1,
        status:1
      }
      const r = await api.patch(`editMessage/${props.dataMessage.id}`,data)
      if(r.data.error){ return }
    }catch(err){
      console.log(err)
    }
  }
  return(
    <div className="bg-slate-700 p-4 absolute rounded text-sm flex flex-col justify-center items-start z-10 shadow-md shadow-black/50 mb-4">
      {/*<button 
        onClick={()=>props.setAnswerMessage(props.dataMessage)}
      className="text-white/80 font-light mb-2 hover:text-white">
        Responder
      </button>*/}
      { props.dataMessage.message!="" && 
        <button 
          onClick={()=>props.setEditMessage(props.dataMessage)}
          className="text-white/80 font-light mb-2 hover:text-white">
          Editar
        </button>}
      { props.dataMessage.public == 1 ? ( 
        <button 
          onClick={()=>props.setRemoveMessage(props.dataMessage)}
          className="text-white/80 font-light hover:text-white">
          Apagar
        </button>
        ):(
          <button 
            onClick={()=>reexibirMessage()}
            className="text-white/80 font-light hover:text-white">
            Reexibir
          </button>
        )}     
    </div>
  )
}
//Actions Messages
type AnswerProps = {
  messageData:ICommunityMessage,
  close:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>
}
const AnswerMessage = (props:AnswerProps) => {
  return(
    <Modal component={
      <div className="flex flex-col">
        ...
        <div className="flex justify-end item">
          <Button name="Fechar" onClick={()=>props.close(null)}/>
        </div>
      </div>
    }/>
  )
}

type EditMessageProps = {
  messageData:ICommunityMessage,
  userdata:IStudent,
  setUpdate:React.Dispatch<React.SetStateAction<boolean>>,
  close:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>
}
const EditMessage = (props:EditMessageProps) => {
  return(
    <Modal className="w-1/2" component={
      <div className="flex flex-col">
        <TitleModal icon="faEdit" title="Editar mensagem" close={()=>props.close(null)}/>
        <div className="bg-neutral-900 rounded my-2 flex justify-center items-center py-8">
          <div className="bg-teal-700  max-w-[250px] lg:max-w-[500px] text-white text-sm font-light shadow shadow-neutral-950/50 rounded-md rounded-se-none">
            <div className="m-3" dangerouslySetInnerHTML={{ __html: props.messageData.message }} />
          </div>
        </div>
        <ChatInput_AdmCommunity 
          action="edit"
          message_id={props.messageData.id}
          initialMessage={props.messageData.message}
          userdata={props.userdata}
          answerMessage={props.messageData.id}
          setUpdate={props.setUpdate}
          close={props.close}
          />      
    </div>
    }/>
  )
}

type RemoveMessageProps = {
  messageData:ICommunityMessage,
  close:React.Dispatch<React.SetStateAction<ICommunityMessage|null>>
}
const RemoveMessage = (props:RemoveMessageProps) => {
  const removeMessage = async (publicStatus:number,status:number) => {
    try{
      const data = {
        public:publicStatus,
        status:status
      }
      const r = await api.patch(`editMessage/${props.messageData.id}`,data)
      if(r.data.error){ return }
      props.close(null)
    }catch(err){
      console.log(err)
    }
  }
  return(
    <Modal component={
      <div className="flex flex-col">
        <p className="text-white font-light mr-8 my-4 mx-4">Deseja apagar a mensagem?</p>
        <div className="flex justify-end item mt-4 pl-20">
          <Button btn="muted" type="notline" name="Cancelar" onClick={()=>props.close(null)}/>
          <Button btn="error" type="outline" name="Apagar para outros membros" onClick={()=>removeMessage(0,1)}/>
          <Button btn="error" name="Remover para todos" onClick={()=>removeMessage(0,0)}/>
        </div>
      </div>
    }/>
  )
}



type PropsMedia = {
  mediaId:number,
  message:string
}
const LoadMedia = (props:PropsMedia) => {
  const [ dataMedia, setDataMedia ] = useState<ICommunityMedia|null|false>(null)
  const [ error, setError ] = useState<string|null>(null)
  const getMedia = async () => {
    try{
      const media = await api.get(`loadMedia/${props.mediaId}`)
      if(media.data.error){
        setError(media.data.message)
        return
      }
      setDataMedia(media.data.response)      
    }catch(err){
      setError('Ocorreu um erro ao carregar os dados da mídia!')
    }
  }
  useEffect(()=>{getMedia()},[])
  return(
    dataMedia === null ? (
      <LoadingBars/>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : dataMedia === false ? (
      <p>Impossivel carregar os dados</p>
    ) : dataMedia.type_media=="audio" ? (
      <CustomAudio seconds={dataMedia.duration} src={`${urlBase}/media/${dataMedia.file}`}  />
    ) : dataMedia.type_media=="image" ? (
      <div className="flex flex-col">
        <div className="bg-slate-200 rounded">
          <img src={`${urlBase}/media/${dataMedia.file}`} style={{width:'100%',height:'auto'}}/>
        </div>
        {props.message != "" && <div className="m-3" dangerouslySetInnerHTML={{ __html: props.message }} />}
      </div>
    ) : dataMedia.type_media=="doc" ? (
      <div className="flex flex-col">
        <div className="flex justify-center items-center bg-slate-700 p-4 rounded ">
          <a 
            className="opacity-90 hover:opacity-100 flex justify-center items-center"
            href={`${urlBase}/media/${dataMedia.file}`} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon 
            className="mr-2 text-2xl text-pink-500" icon={faFile}/> {dataMedia.file}
          </a>
        </div>
        {props.message != "" && <div className="m-3" dangerouslySetInnerHTML={{ __html: props.message }} />}
      </div>
    ) : (
      <div>
        {dataMedia.file}
      </div>
    )    
  )
}

type PropsAudio = {
  src:string;
  seconds?: number;
}
const CustomAudio = (props:PropsAudio) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if(audioRef.current){ isPlaying ? audioRef.current.pause() : audioRef.current.play() }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    Math.floor(audioRef.current.currentTime) >= duration ? setIsPlaying(false) : false
  };

  const handleLoadedMetadata = () => {
    setDuration(props.seconds ? props.seconds : audioRef.current.duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return(
    <div className="flex justify-center items-center mx-3">
    <audio 
      ref={audioRef} 
      src={props.src} 
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}>          
      </audio>
    { isPlaying ? 
      <Button icon="faPause" btn="muted" type="notline" border="circle" size="sm" onClick={()=>togglePlay()}/> 
    : <Button icon="faPlay" btn="muted" size="sm" type="notline" border="circle" onClick={()=>togglePlay()}/> }
      
    <div className="flex flex-col justify-center items-end mt-2">
      {/*Progress Bar */}
      <div className="w-[200px] h-[0.4rem] bg-gray-300 rounded overflow-hidden">
      <div
        className="h-full bg-cyan-500"
        style={{ width: `${(currentTime / duration) * 100}%` }}
      ></div>
    </div>
    <div className="flex w-full justify-start text-xs font-light text-white mt-1">
      <p>{formatTime(currentTime)} / {formatTime(duration)}</p>        
    </div>     
    </div>
  </div>
  )
}