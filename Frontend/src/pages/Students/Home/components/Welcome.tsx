import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { SocialMedia, WelcomeButtons, WelcomeText, WelcomeVideo } from '../Dtos/homeConfigs.dto';
import { Loading } from '../../../../components/Loading';
import { RenderImageGallery } from '../../../../components/RenderImageGallery';
import { Button, ButtonDefault } from '../../../../components/Buttons';




type WelcomeComponent = {
  studentId:number;
}
export const Welcome : React.FC<WelcomeComponent> = (props) => {
  const [ typeAccess, setTypeAccess ] = useState<null | 'community' | 'default'>(null)
  const checkTypeAccess = async () => {
    try{
      const type = await api.get(`checkTypeStudentAccess/${props.studentId}`)
      console.log("Type",type.data.response)
      setTypeAccess(type.data.response['community'] == 1 ? 'community' : 'default')
    }catch(err){
      console.error(err)
    }
  }

  const [ socialMediaChannels, setSocialMediaChannels ] = useState<null |SocialMedia[]>(null)
  const getSocialMediaChannels = async () => {
    try{
      const smc = await api.get(`getSocialMedias`)
      setSocialMediaChannels(smc.data.response)
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    checkTypeAccess()
    getSocialMediaChannels()
  },[])

  const openLink = async (link:string) => { window.open(link, '_blank'); }

  return(
    <>
      { typeAccess === null ? <Loading/>
      : typeAccess == 'community' ? <HomeCommunity/> : <HomeDefault/>}

      <div className="flex flex-col ml-20
                      lg:ml-28 xl:ml-28 2xl:ml-28">
        <p className="text-white font-black  px-4 mb-4 text-shadow-custom
                        text-xl 2xl:text-2xl "></p>
        <div className="flex flex-col justify-start px-4 md:flex-row lg:flex-row 2xl:flex-row">
          { socialMediaChannels === null ? <Loading/>
          : socialMediaChannels.map((channel,key)=> 
            <Button key={key} 
              onClick={()=>openLink(channel.link)} 
              className="w-full md:w-auto lg:w-auto xl:w-auto 2xl:w-auto"
              type="outline"
              btn={ channel.social_media === 'whatsapp' ? "success"
                  : channel.social_media === 'telegram' ? "info"
                  : channel.social_media === 'instagram' ? "warning"
                  : channel.social_media === 'youtube' ? "error"
                  : channel.social_media === 'twitter' ? "info"
                  : channel.social_media === 'mail' ? "light"
                  : "light"
                }
              icon={channel.social_media === "mail" ? "faEnvelope" : null} 
              iconBrand={ channel.social_media === 'whatsapp' ? "faWhatsapp"
                        : channel.social_media === 'telegram' ? "faTelegram"
                        : channel.social_media === 'instagram' ? "faInstagram"
                        : channel.social_media === 'youtube' ? "faYoutube"
                        : channel.social_media === 'twitter' ? "faXTwitter"
                        : null
              }
              name={channel.text}/>) }
        </div>
      </div>
    </>
  )
}


const HomeCommunity = () => {
  const [ video, setVideo ] = useState<WelcomeVideo|null>(null)
  const getConfigHome = async () => {
    try{
      const conf = await api.get('getVideoWelcomeCommunity')
      conf.data.error ? console.error(conf.data.error)
      : setVideo(conf.data.response)
    }catch(err){
      console.error(err)
    }
  }
  const [ textHome, setTextHome ] = useState<WelcomeText|null>(null)
  const getTextHome = async () => {
    try{
      const conf = await api.get('getTextHomeCommunity')
      conf.data.error ? console.error(conf.data.error)
      : setTextHome(conf.data.response)
    }catch(err){
      console.error(err)
    }
  }

  const [ buttonsHome, setButtonsHome ] = useState<WelcomeButtons[]|null>(null)
  const getButtonsHome = async () => {
    try{
      const btns = await api.get('getButtonsCommunity')
      btns.data.error ? console.error(btns.data.error)
      : setButtonsHome(btns.data.response)
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    getConfigHome()
    getTextHome()
    getButtonsHome()
  },[])

  const openLink = async (link:string) => { window.open(link, '_blank'); }

  return(
    <div className="flex flex-col mt-[300px] justify-center items-start mr-4 ml-20
                    lg:ml-28 xl:ml-28 2xl:ml-28 2xl:mt-[600px]">
      { video === null ? <Loading/> 
      : video.idvideo_welcome ?      
        <iframe 
          className="bg-slate-900 rounded-xl  shadow-md shadow-black
                    w-[500px] h-[274px]
                    2xl:w-[600px] 2xl:h-[329px]        
                    " 
          width="100%" 
          allow="autoplay; fullscreen" 
          src={`https://player.vimeo.com/video/${video.idvideo_welcome}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}>
        </iframe>
      : video.image_gallery !== null && <RenderImageGallery className="w-1/3 h-[250px]" imageId={video.image_gallery}/>
      }
      
      { textHome === null ? <Loading/> :
        <div className="flex flex-col flex-1 justify-start items-start px-4">
          <p className="text-white font-black  mb-4 text-shadow-custom
                        text-xl 2xl:text-2xl ">
            {textHome.title_text}
          </p>
          <p className="text-slate-300 font-light text-shadow-custom my-2
                        text-sm 2xl:text-xl">
            {textHome.text}
          </p>
          {textHome.additional_text && 
          <p className="text-slate-300 font-light text-shadow-custom my-2
                      text-sm 2xl:text-xl">
            {textHome.additional_text}
          </p>}
          <div className="flex flex-col w-full my-2 md:flex-row lg:flex-row 2xl:flex-row">
          { buttonsHome === null ? <Loading/> 
          : buttonsHome.length >0 && 
          buttonsHome.map((button,key)=> 
            button.type === 'default' ? 
              <ButtonDefault key={key} className="mb-3 m-2 text-xs 2xl:text-lg 2xl:py-4"
                onClick={()=>openLink(button.link)} icon={button.icon}
                name={button.name}/>
            : <Button key={key} className="mb-3 m-2 text-xs 2xl:text-lg 2xl:py-4" onClick={()=>openLink(button.link)} btn={button.type} icon={button.icon} name={button.name}/>
            )}
          </div>      
        </div>
      }
    </div>
  )
}

const HomeDefault = () => {
  const [ video, setVideo ] = useState<WelcomeVideo|null>(null)
  const getConfigHome = async () => {
    try{
      const conf = await api.get('getVideoWelcome')
      conf.data.error ? console.error(conf.data.error)
      : setVideo(conf.data.response)
    }catch(err){
      console.error(err)
    }
  }
  const [ textHome, setTextHome ] = useState<WelcomeText|null>(null)
  const getTextHome = async () => {
    try{
      const conf = await api.get('getTextHome')
      conf.data.error ? console.error(conf.data.error)
      : setTextHome(conf.data.response)
    }catch(err){
      console.error(err)
    }
  }

  const [ buttonsHome, setButtonsHome ] = useState<WelcomeButtons[]|null>(null)
  const getButtonsHome = async () => {
    try{
      const btns = await api.get('getButtons')
      btns.data.error ? console.error(btns.data.error)
      : setButtonsHome(btns.data.response)
    }catch(err){
      console.error(err)
    }
  }
  useEffect(()=>{
    getConfigHome()
    getTextHome()
    getButtonsHome()
  },[])

  const openLink = async (link:string) => { window.open(link, '_blank'); }

  return(
    <div className="flex mt-[300px] 2xl:mt-[600px] justify-center items-center ml-28 mr-4">
      { video === null ? <Loading/> 
      : video.idvideo_welcome ?      
        <iframe 
          className="bg-slate-900 rounded-xl  shadow-md shadow-black
                    w-[500px] h-[274px]
                    2xl:w-[600px] 2xl:h-[329px]        
                    " 
          width="100%" 
          allow="autoplay; fullscreen" 
          src={`https://player.vimeo.com/video/${video.idvideo_welcome}?color=ff9933&title=0&byline=0&portrait=0&badge=0`}>
        </iframe>
      : video.image_gallery && <RenderImageGallery className="w-1/3 h-[250px]" imageId={video.image_gallery}/>
      }
      
      { textHome === null ? <Loading/> :
        <div className="flex flex-col flex-1 justify-start items-start px-4">
          <p className="text-white font-black  mb-4 text-shadow-custom
                        text-xl 2xl:text-2xl ">
            {textHome.title_text}
          </p>
          <p className="text-slate-300 font-light text-shadow-custom my-2
                        text-sm 2xl:text-xl">
            {textHome.text}
          </p>
          {textHome.additional_text && 
          <p className="text-slate-300 font-light text-shadow-custom my-2
                      text-sm 2xl:text-xl">
            {textHome.additional_text}
          </p>}
          <div className="flex flex-col my-2 md:flex-row lg:flex-row 2xl:flex-row">
          { buttonsHome === null ? <Loading/> 
          : buttonsHome.length >0 && 
          buttonsHome.map((button,key)=> 
            button.type === 'default' ? 
              <ButtonDefault key={key} className="mb-3 m-2 text-xs 2xl:text-lg 2xl:py-4"
                onClick={()=>openLink(button.link)} icon={button.icon}
                name={button.name}/>
            : <Button key={key} className="mb-3 m-2 text-xs 2xl:text-lg 2xl:py-4" onClick={()=>openLink(button.link)} btn={button.type} icon={button.icon} name={button.name}/>
            )}
          </div>       
        </div>
      }
    </div>
  )
}