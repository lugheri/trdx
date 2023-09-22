import { useState, useEffect } from 'react'
import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"
import api from '../../../../services/api';

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

  return (
    <div className="flex p-2 flex-col">
      {/*TITLE */}
      <TitlePage
        icon="faGears" 
        title="Comunidade | Configurações" 
        description="Configurações da comunidade"/>
      
      <Card component={
        <div className="flex">  
          {welcomeVideo === null ? <p>Carregando</p>:
           !welcomeVideo ? <p>Novo</p> :
          <div className="flex">
            <div className="">Video home {welcomeVideo.idvideo_welcome}</div>
            <div className="">{welcomeVideo.video_platform}</div>
          </div>
          }         
        </div>
      }/>

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