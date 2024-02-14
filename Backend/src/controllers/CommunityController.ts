import { Request, Response } from "express";
import { CommunityMessageDTO } from "./Dtos/community.dto";
import communityMessageService from "../services/communityMessageService";

class CommunityController{
  async listMessagesCommunity(req:Request,res:Response){
    const page = parseInt(req.params.page)
    try{
      const messages = await communityMessageService.listMessages(page)
      res.json({"success":true,"response":messages})
    }catch(err){
      res.json({
        "error":true,
        "message":"Ocorreu um erro ao recuperar os itens",
        "error_info":err
      })
    }
  }

  async newMessage(req:Request,res:Response){
    const dataMessage = CommunityMessageDTO.safeParse({ ...req.body,user_last_message:await communityMessageService.getUserLastMessage()})
    if(dataMessage.success){
      try{
        await communityMessageService.newMessage(dataMessage.data)
        res.json({"success":true})
      }catch(err){
        res.json({
          "error":true,
          "message":"Ocorreu um erro ao salvar o item",
          "error_info":err
        })
      }
      return
    }
    res.json({
      "error":true,
      "message":dataMessage.error.message
    })
  }

  async newMediaMessage(req:Request,res:Response){
    
  }
  
  async editMessage(req:Request,res:Response){

  }
}
export default new CommunityController();