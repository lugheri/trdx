import { Request, Response } from 'express';
import { ButtonHomeCommunityDTO, TextHomeCommunityDTO, WelcomeVideoDTO } from './Dtos/communityConfig.dto';
import communityHomeConfigService from '../services/communityHomeConfigService';
import communityHomeButtonsServices from '../services/communityHomeButtonsServices';
class ContentController{
  //Video
  async getVideoWelcome(req:Request,res:Response){
    try{
      const video = await communityHomeConfigService.getWelcomeVideo()
      res.json({"success": true,"response": video})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
  async updateVideoWelcome(req:Request,res:Response){
    const dataVideoWelcome = WelcomeVideoDTO.safeParse(req.body)
    if(!dataVideoWelcome.success){
      res.json({"error":dataVideoWelcome.error})
      return
    }
    try{
      const newVideoWelcome = await communityHomeConfigService.updateWelcomeVideo(dataVideoWelcome.data)
      if(newVideoWelcome){
        res.json({"success": true,"response": newVideoWelcome})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo video!"})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
  //Text
  async getTextHomeCommunity(req:Request,res:Response){
    try{
      const textHome = await communityHomeConfigService.getTextHome()
      res.json(textHome)
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }

  }
  async updateTextHomeCommunity(req:Request,res:Response){
    const dataTextHomeCommunity = TextHomeCommunityDTO.safeParse(req.body)
    if(!dataTextHomeCommunity.success){
      res.json({"error":dataTextHomeCommunity.error})
      return
    }
    try{
      const newTextHomeCommunity = await communityHomeConfigService.updateTextHome(dataTextHomeCommunity.data)
      if(newTextHomeCommunity){
        res.json({"success": true,"response": newTextHomeCommunity})  
        return
      }
      res.json({"error":"Falha ao cadastrar novo video!"})  
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
  //Buttons
  async newButton(req:Request,res:Response){    
    const dataButton = ButtonHomeCommunityDTO.safeParse(req.body)
    if(!dataButton.success){
      res.json({"error":dataButton.error})
      return
    }
    try{
      const newButton = await communityHomeButtonsServices.newButtonHome(dataButton.data)
      res.json({"success": true,"response": newButton})
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async getButtons(req:Request,res:Response){  
    try{
      const buttons = await communityHomeButtonsServices.getButtonsHome()
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
      const infoButton = await communityHomeButtonsServices.infoButtonHome(button_id)
      res.json({"success":true,"response":infoButton})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
  async updateButton(req:Request,res:Response){    
    const button_id = parseInt(req.params.button_id)
    const dataButton = ButtonHomeCommunityDTO.safeParse(req.body)
    if(!dataButton.success){
      res.json({"error":dataButton.error})
      return
    }
    try{
      const updateButton = await communityHomeButtonsServices.updateButtonHome(button_id,dataButton.data)
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
      await communityHomeButtonsServices.deleteButtonHome(button_id) 
      res.json({"success":true})
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }
}
export default new ContentController();