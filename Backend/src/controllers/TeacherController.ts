import { Request, Response } from 'express';
import courseTeachersService from '../services/courseTeachersService';
import { TeacherDTO } from './Dtos/teachers.dto';

class TeacherController{
  //Courses
  async newTeacher(req:Request,res:Response){
    const dataTeacher = TeacherDTO.safeParse(req.body)
    if(!dataTeacher.success){
      res.json({"error":dataTeacher.error})
      return
    }
    try{
      const dataNewTeacher = await courseTeachersService.createNewTeacher(dataTeacher.data)
      if(dataNewTeacher){
        res.json({"success": true,"response": dataNewTeacher})  
        return
      }
      res.json({"error":"Falha ao criar o novo Professor!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async listTeachers(req:Request,res:Response){
    try{
      const listCourses = await courseTeachersService.listTeachers()
      res.json({"success": true,"response": listCourses})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  
  async infoTeacher(req:Request,res:Response){    
    const teacherId = parseInt(req.params.teacherId)
    try{
      const infoTeacher = await courseTeachersService.infoTeacher(teacherId) 
      res.json({"success":true,"response":infoTeacher})
      return
      return
    }catch(err){
      res.json({"error":err})
      return
    }
  }


  async editTeacher(req:Request, res:Response){ 
    const teacherId : number = parseInt(req.params.teacherId)
    const dataTeacher = TeacherDTO.safeParse(req.body)
    if(!dataTeacher.success){
      res.json({"error": dataTeacher.error})  
      return
    }
    try{
      const edit = await courseTeachersService.editTeacher(teacherId, dataTeacher.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

}
export default new TeacherController();