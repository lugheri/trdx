import { Request, Response } from 'express';
import { WelcomeVideoDTO } from './Dtos/communityConfig.dto';
import contentHomeConfigService from '../services/contentHomeConfigService';
class ContentController{
  async getVideoWelcome(req:Request,res:Response){
    try{
      const video = await contentHomeConfigService.getWelcomeVideo()
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
      const newVideoWelcome = await contentHomeConfigService.createNewWelcomeVideo(dataVideoWelcome.data)
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
  
  async getButtonInitCTA(req:Request,res:Response){      
     
    
  }
  
  async updateButtonInitCTA(req:Request,res:Response){

  }
  
  async getButtonInitLink(req:Request,res:Response){

  }
  
  async updateButtonInitLink(req:Request,res:Response){

  }
  
  async getInformationText(req:Request,res:Response){

  }

  async updateInformationText(req:Request,res:Response){

  }
}
export default new ContentController();