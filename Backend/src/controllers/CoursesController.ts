import { Request, Response } from 'express';
import coursesService from '../services/coursesService';
import { PaginationCoursesDTO, SearchCoursesDTO, CoursesDTO, CoursesPartialDTO } from "./Dtos/courses.dto";
import studentCoursesServices from '../services/studentCoursesServices';
import coursesValidityContractsService from '../services/coursesValidityContractsService';
import coursesLessonsService from '../services/coursesLessonsService';
import lessonsViewedService from '../services/lessonsViewedService';
import { parseISO, isAfter, format } from 'date-fns';

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

  async validityCourse(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    const courseId = parseInt(req.params.courseId)
    try{
      const validityCourse = await coursesValidityContractsService.validityCourse(courseId,studentId)
      let contractStatus = 'expired'
      if(validityCourse){
        if(validityCourse.payment_cycle == 'V'){
          contractStatus='valid'
        }else{
          const endContract = validityCourse.end_validity
          const today = new Date();
          const dateEndedContract = parseISO(endContract);
          if (isAfter(dateEndedContract, today) || format(dateEndedContract, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            contractStatus='valid'
          } else {
            contractStatus='expired'
          }
        }
      }
      res.json({"success":true,"response":contractStatus})
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async progressCourse(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    const courseId = parseInt(req.params.courseId)
    try{
      const lessonsCourse = await coursesLessonsService.lessonsCourse(courseId)
      const viewedLessons = await lessonsViewedService.lessonsViewed(studentId,courseId)
      const progress = viewedLessons == 0 ? 0 : Math.round((viewedLessons/lessonsCourse)*100)

      
      res.json({"success":true,"response":progress})
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

}

export default new CoursesController();