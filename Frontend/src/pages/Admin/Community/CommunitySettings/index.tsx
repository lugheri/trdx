import { useState, useEffect } from 'react'
import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"
import api from '../../../../services/api';

import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../../../components/Buttons';
import { Modal, TitleModal } from '../../../../components/Modal';

interface IWelcomeVideo{
  idvideo_welcome:string;
  video_platform:string;
}

export const CommunitySettings = () => {
  const [ welcomeVideo, setWelcomeVideo ] = useState<IWelcomeVideo|null>(null)
  const getVideoWelcome = async () => {
    try{
      const response = await api.get('getVideoWelcome')
      console.log('RESPONSE',response.data.response)
      setWelcomeVideo(response.data.response)
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    getVideoWelcome()
  },[])

  const [ newVideo, setNewVideo ] = useState<boolean>(false)
  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faGears" 
        title="Comunidade | Configurações" 
        description="Configurações da comunidade"/>
      
      <Card component={
        <div className="flex flex-col flex-1">  
          <p className="font-semibold text-stone-400">
            <FontAwesomeIcon className="text-green-600" icon={Fas.faVideo}/> Vídeo de Boas Vindas
          </p>
          {welcomeVideo === null ? <p>Carregando</p>:
          ! welcomeVideo ? 
          <div className="flex flex-col flex-1 justify-center items-center p-4">
            <Button icon="faPlus" btn="success" type='notline' name='Cadastrar Novo Vídeo' onClick={()=>setNewVideo(true)}/>
          </div> :
          <div className="flex">
            <div className="">Video home {welcomeVideo.idvideo_welcome}</div>
            <div className="">{welcomeVideo.video_platform}</div>
          </div>
          }         
        </div>
      }/>
      {newVideo && <Modal component={<div>
          <TitleModal icon='faVideo' title='Cadastrar novo vídeo' close={()=>setNewVideo(false)}/>
          Novo Video
        </div>}/>}

      <Card component={
        <div className="flex">        
         TEXTO
        </div>
      }/>

      <Card component={
        <div className="flex">        
         REDES SOCIAIS
        </div>
      }/>
     


    </div>
  )
}