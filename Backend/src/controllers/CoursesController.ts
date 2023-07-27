import { Request, Response } from 'express';
import coursesService from '../services/coursesService';
import { PaginationCoursesDTO, SearchCoursesDTO, CoursesDTO } from "./Dtos/courses.dto";

class CoursesController{
  async listCourses(req:Request,res:Response){
    const pagination = PaginationCoursesDTO.safeParse(req.body)
    if(!pagination.success){
      res.json({"error": pagination.error})  
      return
    }  
    try{
      const listCourses = await coursesService.listCourses(pagination.data)
      res.json({"success": true,"response": listCourses})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

}

export default new CoursesController();