import { Request, Response } from 'express';
import coursesService from '../services/coursesService';
import { PaginationCoursesDTO, SearchCoursesDTO, CoursesDTO, CoursesPartialDTO } from "./Dtos/courses.dto";
import studentCoursesServices from '../services/studentCoursesServices';

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

  async newCourse(req:Request,res:Response){
    const dataCourse = CoursesDTO.safeParse(req.body)
    if(!dataCourse.success){
      res.json({"error":dataCourse.error})
      return
    }
    try{
      const dataNewCourse = await coursesService.createNewCourse(dataCourse.data)
      if(dataNewCourse){
        res.json({"success": true,"response": dataNewCourse})  
        return
      }
      res.json({"error":"Falha ao criar o novo Curso!"})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
    
  }

  async infoCourse(req:Request,res:Response){
    const courseId : number = parseInt(req.params.courseId)
    try{
      const course = await coursesService.getCourse(courseId)
      console.log(course)
      res.json({"success": true,"response": course})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async editCourse(req:Request, res:Response){
    const courseId : number = parseInt(req.params.courseId)
    const dataCourse = CoursesPartialDTO.safeParse(req.body)
    if(!dataCourse.success){
      res.json({"error": dataCourse.error})  
      return
    }
    try{
      const edit = await coursesService.editCourse(courseId, dataCourse.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  //Students Methods
  async myCourses(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    try{
      const myCourses = await studentCoursesServices.myCourses(studentId)
      res.json({"success":true,"response":myCourses})
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

}

export default new CoursesController();