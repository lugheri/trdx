import { Request, Response } from "express";
import studentsService from "../services/studentsService";

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
}
export default new CommunityAdmController()