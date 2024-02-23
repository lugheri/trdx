import { useEffect, useRef, useState } from "react"
import { StudentProfilePhoto } from "../../../../../components/StudentProfilePhoto"
import { Student } from "../../../../../contexts/Dtos/auth.dto"
import { ICommunityMedia, ICommunityMessage } from "../../Dto/community.dto"
import api from "../../../../../services/api"
import { LoadingBars } from "../../../../../components/Loading"
import { Button } from "../../../../../components/Buttons"
import { urlBase } from "../../../../../utils/baseUrl"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile } from "@fortawesome/free-solid-svg-icons"

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
      <div className="py-1 px-4 flex">       
        <div className="flex flex-col flex-1 justify-end">
          <div className="bg-teal-700 max-w-[250px] lg:max-w-[500px] text-white text-sm font-light shadow shadow-neutral-950/50 rounded-md rounded-se-none">
            { props.message.media === 0 ? (
              <p className="m-3">{props.message.message}</p>
            ) : (
              <LoadMedia mediaId={props.message.media}  message={props.message.message}  />
            )}
          </div>
        </div> 
      </div>
    </div>
  )
}
const OtherMessage = (props:PropsMessageType) => {
  return(
    <div className="flex flex-1">
      <div className="flex overflow-hidden">
        { props.message.user_last_message === props.message.user_id ? (
          <>
            <div className="mx-2 w-10 ">
            </div>
            <div className="flex flex-col flex-1">              
              <div className="bg-neutral-700 max-w-[200px] lg:max-w-[500px] mb-1 text-white text-sm font-light shadow shadow-neutral-950/50 rounded-md rounded-ss-none">
              { props.message.media === 0 ? (
                <p className="m-3">{props.message.message}</p>
              ) : (
                <LoadMedia mediaId={props.message.media} message={props.message.message} />
              )}
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
              <div className="bg-neutral-700 max-w-[200px] lg:max-w-[500px] mb-1 text-white text-sm font-light rounded-md rounded-ss-none shadow shadow-neutral-950/50">
                { props.message.media === 0 ? (
                  <p className="m-3">{props.message.message}</p>
                ) : (
                  <LoadMedia mediaId={props.message.media} message={props.message.message} />
                )}
              </div>
            </div> 
          </>
        )}               
      </div>
    </div>
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
        {props.message != "" && <p className="m-3">{props.message}</p>}
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
        {props.message != "" && <p className="m-3">{props.message}</p>}
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