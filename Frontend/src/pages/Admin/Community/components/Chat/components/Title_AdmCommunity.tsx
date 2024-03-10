import { useEffect, useState } from "react"
import api from "../../../../../../services/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { faCog, faExclamationTriangle, faSearch } from "@fortawesome/free-solid-svg-icons"
import { InputForm } from "../../../../../../components/Inputs"
import { ICommunitySetup } from "../../../../../Students/CommunityStudent/Dto/community.dto"
import { LoadingBars } from "../../../../../../components/Loading"
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export const Title_AdmCommunity = () => {
  const [ member, setMember ] = useState(0)
  const [ onLine, setOnline ] = useState(0)

  const [searchMessages, setSearchMessages ] = useState(false)
  const [searchParams, setSearchParams ] = useState('')
  const [setupCommunity, setSetupCommunity ] = useState(false)
  
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
    const interval = setInterval(() => { getInfoMembers() }, 1500);
    return () => clearInterval(interval);
  },[])

  const handleOpenSetup = () => {
    setSearchMessages(false)
    setSetupCommunity(!setupCommunity)
  }

  const handleOpenSearch = () => {
    setSearchMessages(!searchMessages)
    setSetupCommunity(false)
  }
  
  return(
    <div className="flex justify-between items-center p-2 mb-1 border-b border-b-white/20 mx-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-white text-sm text-center">Comunidade TraderX</p>
        <p className="text-xs text-white/50 font-light text-center">{member} Members, {onLine} Online</p>
      </div>
      <div className="flex justify-end items-center relative">
      { searchMessages ? (
        <SearchMessages searchParams={searchParams} setSearchParams={setSearchParams}/>
      ):(
        <button className="text text-white/50 hover:text-white mx-2" onClick={()=>handleOpenSearch()}>
          <FontAwesomeIcon icon={faSearch}/>
        </button>  
      )}
      </div>
      <div className="flex justify-end items-center relative">
        <button className="text text-white/50 hover:text-white mx-2" onClick={()=>handleOpenSetup()}>
          <FontAwesomeIcon icon={faCog}/>
        </button>     
        {setupCommunity && <SetupCommunity close={setSetupCommunity}/>}           
      </div>
    </div>  
  )
}

type searchProps = {
  searchParams:string,
  setSearchParams:React.Dispatch<React.SetStateAction<string|null>>
}
const SearchMessages = (props:searchProps) => {
  
  return(
    <div className="flex flex-col w-[500px] mx-2">
      <InputForm value={props.searchParams} onChange={props.setSearchParams} placeholder="Buscar Mensagens" className="text-xs mt-2" />
    </div>  
  )
}


type SetupCommunityProps = {
  close:React.Dispatch<React.SetStateAction<boolean>>
} 
const SetupCommunity = (props:SetupCommunityProps) => {
  const [ error, setError ] = useState<string|null>(null)
  const [ setupCommunity,seSetupCommunity ] = useState<ICommunitySetup|null>(null)
  
  const getInfoSetup = async () => {
    try{
      const i = await api.get(`infoSetupChat`)
      if(i.data.error){
        setError(i.data.message)
        return
      }
      seSetupCommunity(i.data.response ?? [])
      setError(null)
    }catch(err){
      setError(err)
    }
  }
  useEffect(()=>{getInfoSetup()},[])

  //Handle Block
  const handleSetupChat = async (typeBlock:string,param:number) => {
    try{
      if(setupCommunity.id){
        const dataEdit = {
          block_audio_message:typeBlock == 'block_audio_message' ? param : setupCommunity.block_audio_message,
          block_media_message:typeBlock == 'block_media_message' ? param : setupCommunity.block_media_message,
          block_message_message:typeBlock == 'block_message_message' ? param : setupCommunity.block_message_message,
          block_access:typeBlock == 'block_access' ? param : setupCommunity.block_access,
        }
        const r = await api.patch(`/editSetupChat`,dataEdit)
        if(r.data.error){
          setError(r.data.message)
          return
        }
      }else{
        const dataNew = {
          block_audio_message:typeBlock == 'block_audio_message' ? param : 0,
          block_media_message:typeBlock == 'block_media_message' ? param : 0,
          block_message_message:typeBlock == 'block_message_message' ? param : 0,
          block_access:typeBlock == 'block_access' ? param : 0,
        }
        const r = await api.post(`/newSetupChat/`,dataNew)
        if(r.data.error){
          setError(r.data.message)
          return
        }
      }
    }catch(err){
      setError(err)
    }
    //setInfoBlockMember(null)
    getInfoSetup()
  }
  return(
    <>
      <div className="flex flex-col w-[300px] justify-center items-center bg-slate-600 rounded absolute py-4 text-white z-20 top-6">
        { error !== null ? (
          <div className="flex flex-col justify-center items-center mt-4 mb-8 text-red-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="opacity-50 text-4xl"/>
            <p className="text-center text-sm font-light" title={error}>Ocorreu um erro ao buscar as informações do membro!</p>
          </div>
        ) : setupCommunity === null ? <LoadingBars/>
        : (
          <>
          <p className="text-xs mb-2">Configurações do Chat</p>
            <SetupItem icon={'faMicrophone'} label="Envio de Audio" item="block_audio_message" parameter={setupCommunity.block_audio_message} handle={handleSetupChat}/>
            <SetupItem icon={'faImages'} label="Envio de Doc. e Imagens" item="block_media_message" parameter={setupCommunity.block_media_message} handle={handleSetupChat}/>
            <SetupItem icon={'faCommentDots'} label="Envio de Mensagens" item="block_message_message" parameter={setupCommunity.block_message_message} handle={handleSetupChat}/>
            <SetupItem icon={'faComments'} label="Acesso ao Chat" item="block_access" parameter={setupCommunity.block_access} handle={handleSetupChat}/>
          </>)}
      </div>
      <div className="absolute w-screen h-screen z-10 -top-20 -right-4" onClick={()=>props.close(false)}></div>
    </>
  )
}

type SetupProps = {
  icon?:null | keyof typeof Fas;
  label:string,
  item:string,
  parameter:number,
  handle: (typeBlock: string, param: number) => Promise<void>
}
const SetupItem = (props:SetupProps) => {
  return(
    <button 
      className="flex w-full border-t border-white/10 justify-between items-center opacity-90 hover:opacity-100 hover:bg-slate-900 p-4"
      onClick={()=>props.handle(props.item,props.parameter == 1 ? 0 : 1)}>
      <p className="text-xs font-light text-white/80 flex justify-center items-center">
        { props.parameter === 0 ? (
          <FontAwesomeIcon icon={Fas[props.icon] as IconProp} className="text-teal-500 mr-2 text-base"/>
        ):(
          <FontAwesomeIcon icon={Fas.faBan} className="text-red-500 mr-2 text-base"/>
        )}
        {props.label}
      </p>
      { props.parameter === 0 ? (
          <FontAwesomeIcon icon={Fas.faToggleOn} className="text-teal-500 mr-2 text-xl"/>
        ):(
          <FontAwesomeIcon icon={Fas.faToggleOff} className="text-red-500 mr-2 text-xl"/>
        )}
    </button>
  )
}