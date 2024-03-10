import { Request, Response } from "express";
import studentsService from "../services/studentsService";
import { CommunityBlockedMembersDTO, CommunityMessageDTO, CommunitySetupDTO } from "./Dtos/community.dto";
import communityMessageService from "../services/communityMessageService";

class CommunityAdmController{
  async getPhotoProfile(req:Request,res:Response){
    try{
      const mail_student_access = req.params.mail_student_access
      const infoStudent = await studentsService.infoStudentByMail(mail_student_access)
      const photo = infoStudent ? infoStudent.photo : 0
      res.json({"success":true,"response":photo})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }
  async getDataStudentAccess(req:Request,res:Response){
    try{
      const mail_student_access = req.params.mail_student_access
      const infoStudent = await studentsService.infoStudentByMail(mail_student_access)
      res.json({"success":true,"response":infoStudent})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }

  async newSetupChat(req:Request,res:Response){
    try{
      const dataSetup = CommunitySetupDTO.safeParse(req.body)
      if(!dataSetup.success){
        res.json({"error":true,"message":dataSetup.error.message})
        return
      }
      await communityMessageService.newSetupCommunity(dataSetup.data)
      res.json({"success":true})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }

  async infoSetupChat(req:Request,res:Response){
    try{
      const infoSetup = await communityMessageService.getSetupCommunity()
      res.json({"success":true,"response":infoSetup})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }

  async editSetupChat(req:Request,res:Response){
    try{
      const dataSetup = CommunitySetupDTO.safeParse(req.body)
      if(!dataSetup.success){
        res.json({"error":true,"message":dataSetup.error.message})
        return
      }
      await communityMessageService.editSetupCommunity(dataSetup.data)
      res.json({"success":true})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }


  async blockingMember(req:Request,res:Response){
    try{
      const dataBlock = CommunityBlockedMembersDTO.safeParse(req.body)
      if(!dataBlock.success){
        res.json({"error":true,"message":dataBlock.error.message})
        return
      }
      await communityMessageService.blockingMember(dataBlock.data)
      res.json({"success":true})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }

  async editBlockMember(req:Request,res:Response){
    try{
      const member_id = parseInt(req.params.member_id)
      const dataBlock = CommunityBlockedMembersDTO.safeParse(req.body)
      if(!dataBlock.success){
        res.json({"error":true,"message":dataBlock.error.message})
        return
      }
      await communityMessageService.editBlockingMember(member_id,dataBlock.data)
      res.json({"success":true})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }
  
  async infoBlockMember(req:Request,res:Response){
    try{
      const member_id = parseInt(req.params.member_id)
      const infoBlock = await communityMessageService.getDataBlockMember(member_id)
      res.json({"success":true,"response":infoBlock})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }

  async editMessage(req:Request,res:Response){
    try{
      const messageId = parseInt(req.params.message_id)
      const dataMessage = CommunityMessageDTO.safeParse(req.body)
      if(!dataMessage.success){
        res.json({"error":true,"message":dataMessage.error.message})
        return
      }
      await communityMessageService.editMessages(messageId,dataMessage.data)
      res.json({"success":true})
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err})
    }
  }

}
export default new CommunityAdmController()