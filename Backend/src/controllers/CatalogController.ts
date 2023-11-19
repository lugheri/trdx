import { Request, Response } from 'express';

import coursesService from "../services/coursesService"
import { CoursesDTO, CoursesPartialDTO, ModulesCourseDTO, ModulesLessonModuleDTO, PaginationCoursesDTO } from "./Dtos/courses.dto"
import courseModulesService from '../services/courseModulesService';
import coursesLessonsService from '../services/coursesLessonsService';
import LessonsAttachmentsService from '../services/LessonsAttachmentsService';

class CatalogController{
  //Courses
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
      console.error(err)
      res.json({"error":err})  
    }    
  }
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
      console.error(err)
      res.json({"error":err})  
    }
  }
  async infoCourse(req:Request,res:Response){
    const courseId : number = parseInt(req.params.courseId)
    try{
      const course = await coursesService.getCourse(courseId)      
      res.json({"success": true,"response": course})  
      return
    }catch(err){
      console.error(err)
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
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Modules
  async newModuleCourse(req:Request,res:Response){
    const dataModule = ModulesCourseDTO.safeParse(req.body)
    if(!dataModule.success){
      res.json({"error":dataModule.error})
      return
    }
    try{
      const dataNewModule = await courseModulesService.createNewModuleCourse(dataModule.data)
      if(dataNewModule){
        res.json({"success": true,"response": dataNewModule})  
        return
      }
      res.json({"error":"Falha ao criar o novo Módulo!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async modulesCourse(req:Request,res:Response){
    const courseId = parseInt(req.params.courseId)
    try{
      const modulesCourse = await courseModulesService.modulesCourse(courseId);
      res.json({"success":true,"response":modulesCourse})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
  async infoModuleCourse(req:Request,res:Response){
    const moduleId : number = parseInt(req.params.moduleId)
    try{
      const infoModule = await courseModulesService.infoModuleCourse(moduleId)
      res.json({"success": true,"response": infoModule})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async editModuleCourse(req:Request,res:Response){
    const moduleId : number = parseInt(req.params.moduleId)
    const dataModuleCourse = ModulesCourseDTO.safeParse(req.body)
    if(!dataModuleCourse.success){
      res.json({"error": dataModuleCourse.error})  
      return
    }
    try{
      const edit = await courseModulesService.editModuleCourse(moduleId, dataModuleCourse.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Lessons
  async newLessonModule(req:Request,res:Response){
    const dataLesson = ModulesLessonModuleDTO.safeParse(req.body)
    if(!dataLesson.success){
      res.json({"error":dataLesson.error})
      return
    }
    try{
      const dataNewLesson = await  coursesLessonsService.createNewLessonModule(dataLesson.data)
      if(dataNewLesson){
        res.json({"success": true,"response": dataNewLesson})  
        return
      }
      res.json({"error":"Falha ao criar o novo Aula!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async lessonsModule(req:Request,res:Response){
    const moduleId = parseInt(req.params.moduleId)
    try{
      const lessonsModule = await coursesLessonsService.lessonsModulesCourse(moduleId);
      res.json({"success":true,"response":lessonsModule})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
  async infoLessonModule(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    try{
      const infoLesson = await coursesLessonsService.infoLesson(lessonId);
      res.json({"success":true,"response":infoLesson})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
  async editLessonModule(req:Request,res:Response){
    const lessonId : number = parseInt(req.params.lessonId)
    const dataLessonModule = ModulesLessonModuleDTO.safeParse(req.body)
    if(!dataLessonModule.success){
      res.json({"error": dataLessonModule.error})  
      return
    }
    try{
      const edit = await coursesLessonsService.editLessonModule(lessonId, dataLessonModule.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }



 

  

  //Attachments
  async attachmentLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)    
    try{
      const attachmentsLesson = await LessonsAttachmentsService.getAttachmentsLesson(lessonId)
      res.json({"success":true,"response":attachmentsLesson})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }


}
export default new CatalogController();