import { useState, useEffect } from 'react'
/*import { Card } from "../../../../components/Cards"
import { TitlePage } from "../../../../components/Template/TitlePage"*/
import api from '../../../../services/api';

import * as Fab from "@fortawesome/free-brands-svg-icons";
import * as Fas from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../../../components/Buttons';
import { Modal, TitleModal } from '../../../../components/Modal';
import { InputForm } from '../../../../components/Inputs';
/*import { ButtonsHome } from './ButtonsHome';
import { TextHome } from './TextHome';
*/
interface IWelcomeVideo{
  idvideo_welcome:string;
  video_platform:string;
}

export const VideoHome = () => {
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
  const [ newVideo, setNewVideo ] = useState<boolean>(false)
  const [ removeVideo, setRemoveVideo ] = useState<boolean>(false)
  useEffect(()=>{
    getVideoWelcome()
  },[newVideo,removeVideo])
  
  const openLinkVideo = async () => {    
    const link = welcomeVideo ? welcomeVideo.video_platform == 'vimeo' ? `https://vimeo.com/${welcomeVideo.idvideo_welcome}` : `https://www.youtube.com/watch?v=${welcomeVideo.idvideo_welcome}` : ""
    window.open(link, '_blank');   
  }
  return (
    <div className="flex flex-col flex-1">  
      <p className="font-semibold text-stone-400">
        <FontAwesomeIcon className="text-green-600" icon={Fas.faVideo}/> Vídeo de Boas Vindas
      </p>
      {welcomeVideo === null ? <p>Carregando</p> 
      : ! welcomeVideo ? 
        <div className="flex flex-col flex-1 justify-center items-center p-4">
          <Button icon="faPlus" btn="success" type='notline' name='Cadastrar Novo Vídeo' onClick={()=>setNewVideo(true)}/>
        </div> 
      :
        <div className="flex">
          <iframe 
            className="w-[600px] h-[300px] mt-4 rounded-lg overflow-hidden" 
            width="100%" 
            allow="autoplay; fullscreen" 
            src={`https://player.vimeo.com/video/${welcomeVideo.idvideo_welcome}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}>
          </iframe>
          <div className="flex-col">
            {welcomeVideo.video_platform == 'vimeo' ?
              <div className="flex flex-col py-4 px-1">
                <p className="font-light text-sky-400 text-5xl"><FontAwesomeIcon icon={Fab.faVimeo}/> VIMEO</p>
                <p className="font-light my-4 text-xl text-blue-300"><span className="font-semibold text-gray-300">Id do Vídeo:</span> {welcomeVideo.idvideo_welcome}</p>
                <p className="font-light my-4 text-xl text-white">Link do Vídeo: <button onClick={()=>openLinkVideo()} className="font-light text-sky-400 text-xl"><FontAwesomeIcon icon={Fas.faArrowUpRightFromSquare}/> Acessar</button></p>
              </div>
            : welcomeVideo.video_platform == 'youtube'?
              <div className="flex flex-col py-4 px-1">
                <p className="font-light text-red-400 text-5xl"><FontAwesomeIcon icon={Fab.faYoutube}/> YouTube</p>
                <p className="font-light my-4 text-xl text-blue-300"><span className="font-semibold text-gray-300">Id do Vídeo:</span> {welcomeVideo.idvideo_welcome}</p>
                <p className="font-light my-4 text-xl text-white">Link do Vídeo: <button onClick={()=>openLinkVideo()} className="font-light text-red-400 text-xl"><FontAwesomeIcon icon={Fas.faArrowUpRightFromSquare}/> Acessar</button></p>
              </div> 
            : false} 
            <div className="flex">
              <Button icon="faEdit" btn="success" type='outline' name='Alterar Vídeo' onClick={()=>setNewVideo(true)}/>
              <Button icon="faTrash" btn="error" type="notline" name="Remover Vídeo" onClick={()=>setRemoveVideo(true)}/>
            </div>
          </div>

        </div>
      }   
      {newVideo && <Modal component={<NewVideo setWelcomeVideo={setWelcomeVideo} close={setNewVideo}/>}/>}  
      {removeVideo && <Modal component={<RemoveVideo videoId={welcomeVideo ? welcomeVideo.idvideo_welcome : ""} setWelcomeVideo={setWelcomeVideo} close={setRemoveVideo}/>}/>}     
    </div>
  )
}


//New Video
interface NewVideoComponent{
  setWelcomeVideo:React.Dispatch<React.SetStateAction<IWelcomeVideo|null>>,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const NewVideo : React.FC<NewVideoComponent> = (props) => {
  const [ video, setVideo ] = useState("")
  const [ platform, setPlatform ] = useState<"youtube"|"vimeo"|"erro"|"">("")
  const [ idVideo, setIdVideo ] = useState("")
  const [ process, setProcess ] = useState(false)

  useEffect(()=>{      
    if(video.indexOf('youtube')>0){
      const p=video.split("v=");
      if(p[1]){
        setPlatform('youtube')
        setIdVideo(p[1].split("&")[0])      
      }
    }else if(video.indexOf('youtu.be')>0){
      const p=video.split("be/");
      if(p[1]){
        setPlatform('youtube')
        setIdVideo(p[1])      
      }     
    }else if(video.indexOf('vimeo')>0){
      const p=video.split(".com/");
      if(p[1]){
        setPlatform('vimeo')
        setIdVideo(p[1])  
      }     
    }else{
      setPlatform('erro')
    }
  },[video])

  const saveWelcomeVideo = async () => {
    props.setWelcomeVideo({'idvideo_welcome':idVideo,'video_platform':platform})
    setVideo("")
    setPlatform("")
    props.close(false)
    try{
      await api.post("/updateVideoWelcome",{'idvideo_welcome':idVideo,'video_platform':platform})
    }catch(err){
      console.log(err)
    }
  }

  return(
    <div className="flex flex-col">
      <TitleModal icon='faVideo' title='Cadastrar novo vídeo'  close={()=>props.close(false)}/>
      {process === false ?
        <>
          <div className="mt-4 w-[450px]">
            <InputForm label='Insira o Link do Vídeo:' placeholder='Link' value={video} onChange={setVideo} />
          </div>   
          {video !== "" && 
            <div className="flex  border-slate-600 justify-end">
              <Button btn='success' name='Próximo' type='outline' onClick={()=>setProcess(true)}/>
            </div>
          }
        </>
      : 
        <div className="flex flex-col">
          <div>
            <iframe 
              className="w-[600px] h-[300px] mt-4 rounded-lg overflow-hidden" 
              width="100%" 
              allow="autoplay; fullscreen" 
              src={`https://player.vimeo.com/video/${idVideo}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}></iframe>
            {platform == "erro" ?
              <p className="mt-4 px-4 text-white">Não foi possivel encontrar a plataforma do seu vídeo</p>
             : <p className="mt-4 px-4 text-white">Plataforma: {platform}</p>}
             <p className="px-4 text-white font-light">Id do Vídeo: {idVideo}</p>
          </div>  
          <div className="flex  border-slate-600 justify-end">
            <Button btn='light' name='Voltar' type='outline' onClick={()=>setProcess(false)}/>  
            { platform != "erro" &&
            <Button btn='success' name='Concluir' onClick={()=>saveWelcomeVideo()}/>}
          </div>
        </div>
      }
    </div>
  )
}

type RemoveVideoComponent={
  videoId:string,
  setWelcomeVideo:React.Dispatch<React.SetStateAction<IWelcomeVideo|null>>,
  close:React.Dispatch<React.SetStateAction<boolean>>
}
const RemoveVideo : React.FC<RemoveVideoComponent> = (props) => {
  const removeVideo = async () => {
    props.setWelcomeVideo({'idvideo_welcome':"",'video_platform':""})
    props.close(false)
    try{
      await api.post("/updateVideoWelcome",{'idvideo_welcome':"",'video_platform':""})
    }catch(err){
      console.log(err)
    }
  }
  return(
  <div className="flex flex-col">
    <TitleModal icon='faTrash' title='Remover vídeo'  close={()=>props.close(false)}/>
      <div className="flex flex-col">
        <p className="text-gray-400 text-lg p-4">
          Confirmar remoção do vídeo de boas vindas?
        </p>  
        <div className="flex  border-slate-600 justify-end">
          <Button btn='light' name='Não' type='outline' onClick={()=>props.close(false)}/>          
          <Button btn='error' icon="faTrash" name='Sim, Remover' onClick={()=>removeVideo()}/>
        </div>
      </div>    
  </div>
)
}