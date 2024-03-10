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
import { faCommentSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import { ICommunityBlockMember, ICommunitySetup } from "./Dto/community.dto";


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

  //Cheking Setup Chat and access users
  const [ setupCommunity, setSetupCommunity ] = useState<ICommunitySetup|null>(null)
  const [ blockedMember, setBlockedMember ] = useState<ICommunityBlockMember|null>(null)
  const getInfoSetup = async () => {
    try{
      const i = await api.get('infoSetupChat')
      if(i.data.error){
        console.log(i.data.message)
      }
      console.log('info',i.data.response)
      setSetupCommunity(i.data.response)
    }catch(err){
      console.log('Erro',err)
    }
  }
  const getBlockMember = async () => {
    try{
      const i = await api.get(`infoBlockMember/${userData.id}`)
      if(i.data.error){
        console.log(i.data.message)
      }
      const defaultBlock:ICommunityBlockMember = {
        'id':0,
        'date':'--',
        'member_id':0,
        'user_block_responsible':0,
        'block_audio_message':0,
        'block_media_message':0,
        'block_message_message':0,
        'block_access':0
      }
      setBlockedMember(i.data.response === null ? defaultBlock : i.data.response)
    }catch(err){
      console.log('Erro',err)
    }
  }

  useEffect(()=>{
    const setupInt = setInterval(() => {
      getInfoSetup()
      getBlockMember()
    }, 5000); // Roda a cada 5 segundos

    return () => clearInterval(setupInt);   
  },[])

  return(
    userData == null ? (
    <LoadingBars/>
    ) : typeAccess == null ? (
      <div className="flex flex-col justify-center items-center p-20 h-full">        
        <LoadingBars/>
        <p className="text-teal-500/50 font-light">Carregando Mensagens</p>
      </div>      
    ) : setupCommunity == null ? (
      <div className="flex flex-col justify-center items-center p-20 h-full">        
        <LoadingBars/>
        <p className="text-teal-500/50 font-light">Checando configurações do chat</p>
      </div> 
    ) : blockedMember == null ? (
      <div className="flex flex-col justify-center items-center p-20 h-full">        
        <LoadingBars/>
        <p className="text-teal-500/50 font-light">Checando permições  do aluno</p>
      </div> 
    ) : typeAccess === "community" ? (
      //Main Community
      <div className="mr-4 ml-4 md:ml-28 lg:ml-28 xl:ml-28 2xl:ml-28 flex flex-col my-4">
        <CommunityTitleBar 
          userdata={userData} 
          openUserInfo={setOpenUserInfo}/>
        
        <div className="flex justify-start items-center h-[75vh] lg:h-[84vh] ">
          { setupCommunity.block_access + blockedMember.block_access >=1 ? (           
            <div className="flex flex-1 flex-col my-4 justify-center items-center h-full">
              <FontAwesomeIcon className="text-6xl my-4 text-slate-500/50" icon={faCommentSlash}/>
              <p className="font-black text-4xl text-white ">Chat Inativo</p>
              <p className="font-md text-white/50">O chat foi temporariamente desativado</p>
            </div>
          ) : (
            <div 
              className={`bg-neutral-900 h-full rounded-md p-4 flex-col ${openUserInfo === true ? "hidden lg:flex lg:flex-1" : "flex flex-1 lg:px-[12rem]" }`}>
              <CommunityConversationBody 
                page={1}
                userdata={userData}
                setUpdate={setUpdate}
                update={update}/>   
              { setupCommunity.block_message_message + blockedMember.block_message_message == 0 &&
                <CommunityChatInput 
                  userdata={userData}
                  update={update}
                  setUpdate={setUpdate}
                  disableAudio={setupCommunity.block_audio_message + blockedMember.block_audio_message == 0 ? false : true}
                  disableMedia={setupCommunity.block_media_message + blockedMember.block_media_message == 0 ? false : true}
                  
                  />}              
            </div>              
          ) }  
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