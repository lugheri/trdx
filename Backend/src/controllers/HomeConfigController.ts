import { Request, Response } from 'express';
import { ButtonHomeDTO, SocialMediaDTO, TextHomeDTO, WelcomeVideoDTO } from './Dtos/homeConfig.dto';
import homeConfigCommunityService from '../services/homeConfigCommunityService';
import homeButtonsCommunityServices from '../services/homeButtonsCommunityServices';
import homeButtonsService from '../services/homeButtonsService';
import homeConfigService from '../services/homeConfigService';
import socialMediaService from '../services/socialMediaService';

class HomeConfigController{
  //Video Community
  async updateVideoWelcomeCommunity(req:Request,res:Response){
    const dataVideoWelcome = WelcomeVideoDTO.safeParse(req.body)
    if(!dataVideoWelcome.success){
      res.json({"error":dataVideoWelcome.error})
      return
    }
    try{
      const video = await homeConfigCommunityService.getWelcomeVideo()
      let newVideoWelcome
      if(video){ 
        newVideoWelcome = await homeConfigCommunityService.updateWelcomeVideo(dataVideoWelcome.data)
      }else{ 
        newVideoWelcome = await homeConfigCommunityService.createNewWelcomeVideo(dataVideoWelcome.data)
      }   
      if(newVideoWelcome){
        res.json({"success": true,"response": newVideoWelcome})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo video!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async getVideoWelcomeCommunity(req:Request,res:Response){
    try{
      const video = await homeConfigCommunityService.getWelcomeVideo()
      res.json({"success": true,"response": video})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Text Community
  async updateTextHomeCommunity(req:Request,res:Response){
    const dataTextHomeCommunity = TextHomeDTO.safeParse(req.body)
    if(!dataTextHomeCommunity.success){
      res.json({"error":dataTextHomeCommunity.error})
      return
    }
    try{
      const newTextHomeCommunity = await homeConfigCommunityService.updateTextHome(dataTextHomeCommunity.data)
      if(newTextHomeCommunity){
        res.json({"success": true,"response": newTextHomeCommunity})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo video!"})  

      const text = await homeConfigCommunityService.getTextHome()
      let newTextWelcome
      if(text){ 
      newTextWelcome = await homeConfigCommunityService.updateTextHome(dataTextHomeCommunity.data)
      }else{
      newTextWelcome = await homeConfigCommunityService.createNewWelcomeText(dataTextHomeCommunity.data)
      }   
      if(newTextWelcome){
        res.json({"success": true,"response": newTextWelcome})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo texto!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async getTextHomeCommunity(req:Request,res:Response){
    try{
      const textHome = await homeConfigCommunityService.getTextHome()
      res.json({"success": true,"response": textHome})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
    
  //Buttons Community
  async newButtonCommunity(req:Request,res:Response){    
    const dataButton = ButtonHomeDTO.safeParse(req.body)
    if(!dataButton.success){
      res.json({"error":dataButton.error})
      return
    }
    try{
      const newButton = await homeButtonsCommunityServices.newButtonHome(dataButton.data)
      res.json({"success": true,"response": newButton})
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async getButtonsCommunity(req:Request,res:Response){  
    try{
      const buttons = await homeButtonsCommunityServices.getButtonsHome()
      res.json({"success":true,"response":buttons})
      return
    }catch(err){
      res.json({"error":err})
      return 
    }
  }
  async infoButtonCommunity(req:Request,res:Response){   
    const button_id = parseInt(req.params.button_id)
    try{
      const infoButton = await homeButtonsCommunityServices.infoButtonHome(button_id)
      res.json({"success":true,"response":infoButton})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async updateButtonCommunity(req:Request,res:Response){    
    const button_id = parseInt(req.params.button_id)
    const dataButton = ButtonHomeDTO.safeParse(req.body)
    if(!dataButton.success){
      res.json({"error":dataButton.error})
      return
    }
    try{
      const updateButton = await homeButtonsCommunityServices.updateButtonHome(button_id,dataButton.data)
      res.json({"success":true,"response":updateButton})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async deleteButtonCommunity(req:Request,res:Response){    
    const button_id = parseInt(req.params.button_id)
    try{
      await homeButtonsCommunityServices.deleteButtonHome(button_id) 
      res.json({"success":true})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }

  //Video Default
  async updateVideoWelcome(req:Request,res:Response){
    const dataVideoWelcome = WelcomeVideoDTO.safeParse(req.body)
    if(!dataVideoWelcome.success){
      res.json({"error":dataVideoWelcome.error})
      return
    }
    try{
      const video = await homeConfigService.getWelcomeVideo()
      let newVideoWelcome
      if(video){ 
        newVideoWelcome = await homeConfigService.updateWelcomeVideo(dataVideoWelcome.data)
      }else{ 
        newVideoWelcome = await homeConfigService.createNewWelcomeVideo(dataVideoWelcome.data)
      }   
      if(newVideoWelcome){
        res.json({"success": true,"response": newVideoWelcome})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo video!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }    
  async getVideoWelcome(req:Request,res:Response){
    try{
      const video = await homeConfigService.getWelcomeVideo()
      res.json({"success": true,"response": video})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Text Default
  async updateTextHome(req:Request,res:Response){
    const dataTextHome = TextHomeDTO.safeParse(req.body)
    if(!dataTextHome.success){
      res.json({"error":dataTextHome.error})
      return
    }
    try{
      const newTextHome = await homeConfigService.updateTextHome(dataTextHome.data)
      if(newTextHome){
        res.json({"success": true,"response": newTextHome})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo video!"})  

      const text = await homeConfigService.getTextHome()
      let newTextWelcome
      if(text){ 
      newTextWelcome = await homeConfigService.updateTextHome(dataTextHome.data)
      }else{ 
      newTextWelcome = await homeConfigService.createNewWelcomeText(dataTextHome.data)
      }   
      if(newTextWelcome){
        res.json({"success": true,"response": newTextWelcome})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo texto!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async getTextHome(req:Request,res:Response){
    try{
      const textHome = await homeConfigService.getTextHome()
      res.json({"success": true,"response": textHome})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }

  //Buttons Default
  async newButton(req:Request,res:Response){    
    const dataButton = ButtonHomeDTO.safeParse(req.body)
    if(!dataButton.success){
      res.json({"error":dataButton.error})
      return
    }
    try{
      const newButton = await homeButtonsService.newButtonHome(dataButton.data)
      res.json({"success": true,"response": newButton})
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async getButtons(req:Request,res:Response){  
    try{
      const buttons = await homeButtonsService.getButtonsHome()
      res.json({"success":true,"response":buttons})
      return
    }catch(err){
      res.json({"error":err})
      return 
    }
  }
  async infoButton(req:Request,res:Response){   
    const button_id = parseInt(req.params.button_id)
    try{
      const infoButton = await homeButtonsService.infoButtonHome(button_id)
      res.json({"success":true,"response":infoButton})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async updateButton(req:Request,res:Response){    
    const button_id = parseInt(req.params.button_id)
    const dataButton = ButtonHomeDTO.safeParse(req.body)
    if(!dataButton.success){
      res.json({"error":dataButton.error})
      return
    }
    try{
      const updateButton = await homeButtonsService.updateButtonHome(button_id,dataButton.data)
      res.json({"success":true,"response":updateButton})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async deleteButton(req:Request,res:Response){    
    const button_id = parseInt(req.params.button_id)
    try{
      await homeButtonsService.deleteButtonHome(button_id) 
      res.json({"success":true})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }

  //Social Media
  async newSocialMedia(req:Request,res:Response){    
    const dataSocialMedia = SocialMediaDTO.safeParse(req.body)
    if(!dataSocialMedia.success){
      res.json({"error":dataSocialMedia.error})
      return
    }
    try{
      const newSocialMedia = await socialMediaService.newSocialMedia(dataSocialMedia.data)
      res.json({"success": true,"response": newSocialMedia})
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async getSocialMedias(req:Request,res:Response){  
    try{
      const socialMedias = await socialMediaService.getSocialMedias()
      res.json({"success":true,"response":socialMedias})
      return
    }catch(err){
      res.json({"error":err})
      return 
    }
  }
  async infoSocialMedia(req:Request,res:Response){   
    const media_id = parseInt(req.params.media_id)
    try{
      const infoSocialMedia = await socialMediaService.infoSocialMedia(media_id)
      res.json({"success":true,"response":infoSocialMedia})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async updateSocialMedia(req:Request,res:Response){    
    const media_id = parseInt(req.params.media_id)
    const infoSocialMedia = SocialMediaDTO.safeParse(req.body)
    if(!infoSocialMedia.success){
      res.json({"error":infoSocialMedia.error})
      return
    }
    try{
      const updateButton = await socialMediaService.updateSocialMedia(media_id,infoSocialMedia.data)
      res.json({"success":true,"response":updateButton})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async deleteSocialMedia(req:Request,res:Response){    
    const media_id = parseInt(req.params.media_id)
    try{
      await socialMediaService.deleteSocialMedia(media_id) 
      res.json({"success":true})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }

}
export default new HomeConfigController()