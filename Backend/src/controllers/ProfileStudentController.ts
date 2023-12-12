import { Request, Response } from "express";
import { unlink } from 'fs/promises'
import sharp from 'sharp';
import { PhotoProfilePartialDTO, PhotoProfileStudentDTO, PhotoProfileType, StudentPartialDTO } from "./Dtos/student.dto";
import studentsProfilePhotosService from "../services/studentsProfilePhotosService";
import studentsService from "../services/studentsService";

class ProfileController{
  async photoProfile(req:Request,res:Response){
    const fileId: number = parseInt(req.params.photo_id)
    try{
      const infoPhoto = await studentsProfilePhotosService.infoPhoto(fileId)
      res.json({"success":true,"response":infoPhoto})
    }catch(err){
      console.error(err)
    }
  }

  async newPhotoProfile(req:Request,res:Response){
    if(req.file){
      const filename = `${req.file.filename}.jpg`
      await sharp(req.file.path)
            .resize(200)
            .toFormat('jpeg')
            .toFile(`./public/gallery/${filename}`);
      await unlink(req.file.path)     
      
      const dataNewFile = PhotoProfileStudentDTO.safeParse(req.body)
      if(!dataNewFile.success){
        res.json({"error": dataNewFile.error})  
        return      
      }
      try{
        const dataFile:PhotoProfileType={
          "name":`${dataNewFile.data.student_id} - ${dataNewFile.data.name_student}` ,
          "description":`${dataNewFile.data.name_student} Student profile photo`,
          "file":filename,
          "extension":req.file.mimetype, 
          "size":req.file.size,
          "status":1
        }
        const extension = req.file.mimetype
        const size = req.file.size
        const newFile = await studentsProfilePhotosService.newPhoto(dataFile)

        //Update photo student
        if(newFile){
          const studentId : number = parseInt(dataNewFile.data.student_id as string)
          const newProfile = {photo:newFile.id}        
          try{
            const edit = await studentsService.editStudent(studentId, newProfile)
            res.json({"success": true,"response": edit})  
            return
          }catch(err){
            console.error(err)
            res.json({"error":err})  
          }
        }
        res.json({"success":true,"response":newFile})
        return
      }catch(err){
        console.error(err)
      }
    }    
  }


  async getInfoStudent(req:Request,res:Response){
    const studentId : number = parseInt(req.params.student_id)
    try{
      const student = await studentsService.getStudent(studentId)
      res.json({"success": true,"response": student})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async editInfoStudent(req:Request,res:Response){

  }

  async resetPassword(req:Request,res:Response){

  }


}
export default new ProfileController();