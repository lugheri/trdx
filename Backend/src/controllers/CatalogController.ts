import { Request, Response } from 'express';

import coursesService from "../services/coursesService"
import { CoursesDTO, CoursesPartialDTO, LessonAccessRuleDTO, LessonAccessRuleType, LessonAttachmentDTO, LessonAttachmentType, ModulesCourseDTO, ModulesLessonModuleDTO, PaginationCoursesDTO } from "./Dtos/courses.dto"
import courseModulesService from '../services/courseModulesService';
import coursesLessonsService from '../services/coursesLessonsService';
import LessonsAttachmentsService from '../services/LessonsAttachmentsService';
import lessonAccessRulesService from '../services/lessonAccessRulesService';
import moment from 'moment';
import studentsService from '../services/studentsService';

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
  async nextLessonOrder(req:Request,res:Response){
    const moduleId = parseInt(req.params.moduleId)
    try{
      const orderLastLesson = await coursesLessonsService.nextLessonOrder(moduleId);
      let nextOrder = 0
      if(orderLastLesson){
        nextOrder=orderLastLesson.order+1
      }else{
        const infoModule = await courseModulesService.infoModuleCourse(moduleId)
        nextOrder = typeof infoModule == 'boolean' ? 101 : infoModule.order + 1
      }
      res.json({"success":true,"response":nextOrder})
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
  async firstLessonModule(req:Request,res:Response){
    const moduleId : number = parseInt(req.params.moduleId)
    try{
      const lesson = await coursesLessonsService.firstLessonModule(moduleId)
      res.json({"success": true,"response": lesson})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }



 

  

  //Attachments
  async newAttachmentsLesson(req:Request,res:Response){    
    const dataAttachment = LessonAttachmentDTO.safeParse(req.body)
    if(!dataAttachment.success){
      res.json({"error":dataAttachment.error})
      return
    }
    console.log('newAttachmentsLesson',dataAttachment.data)
    try{
      const dataNewAttachment = await LessonsAttachmentsService.createNewAttachmentsLesson(dataAttachment.data)
      if(dataNewAttachment){
        res.json({"success": true,"response": dataNewAttachment})  
        return
      }
      res.json({"error":"Falha ao criar o novo Aula!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async uploadFileAttachments(req:Request,res:Response){
    const dataForm = req.body;
    const dataFile = req.file;   
    const nameFile =  dataFile ? `${dataFile.filename}` : ""

    console.log('uploadFileAttachments',req.file)
    if(dataFile){      
      try{
        const dataAttachment:LessonAttachmentType={
          course_id:dataForm.course_id,
          module_id:dataForm.module_id,
          lesson_id:dataForm.lesson_id,
          name:dataForm.name,
          description:dataForm.description,
          type:dataForm.type,
          material:nameFile,          
          status:1
        }
       
        await LessonsAttachmentsService.createNewAttachmentsLesson(dataAttachment)     
        
        res.json({"success":true,"response":true})
        return
      }catch(err){
        console.error(err)
      }
    }    
    res.json({"error":true})  
  }
  async lessonAttachments(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    try{
      const attachmentsLesson = await LessonsAttachmentsService.getAttachmentsLesson(lessonId)
      res.json({"success":true,"response":attachmentsLesson})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
  async infoAttachmentsLesson(req:Request,res:Response){
    const attachmentId = parseInt(req.params.attachmentId)    
    try{
      const attachmentLesson = await LessonsAttachmentsService.infoAttachmentsLesson(attachmentId)
      res.json({"success":true,"response":attachmentLesson})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
  async editAttachmentsLesson(req:Request,res:Response){
    const attachmentId : number = parseInt(req.params.attachmentId)
    const dataAttachment = LessonAttachmentDTO.safeParse(req.body)
    if(!dataAttachment.success){
      res.json({"error": dataAttachment.error})  
      return
    }
    try{
      await LessonsAttachmentsService.editAttachmentLesson(attachmentId,dataAttachment.data)
      res.json({"success": true,"response": true})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async removeAttachmentsLesson(req:Request,res:Response){
    const attachmentId : number = parseInt(req.params.attachmentId)
    const lessonId : number = parseInt(req.params.lessonId)   
    try{
      await LessonsAttachmentsService.deleteAttachmentLesson(attachmentId,lessonId)
      res.json({"success": true,"response": true})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //LessonAccessRule
  async newAccessRuleLesson(req:Request,res:Response){
    const dataAccessRule = LessonAccessRuleDTO.safeParse(req.body)
    if(!dataAccessRule.success){
      res.json({"error":dataAccessRule.error})
      return
    }
    try{
      const dataNewAccessRuleLesson = await  lessonAccessRulesService.createNewLessonAccessRule(dataAccessRule.data)
      if(dataNewAccessRuleLesson){
        res.json({"success": true,"response": dataNewAccessRuleLesson})  
        return
      }
      res.json({"error":"Falha ao criar o novo Aula!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async lessonAccessRule(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    try{
      const accessRule = await lessonAccessRulesService.getLessonAccessRule(lessonId);
      res.json({"success":true,"response":accessRule})
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }
  async editLessonAccessRule(req:Request,res:Response){
    const lessonId : number = parseInt(req.params.lessonId)
    const dataLessonAccessRule = LessonAccessRuleDTO.safeParse(req.body)
    if(!dataLessonAccessRule.success){
      res.json({"error": dataLessonAccessRule.error})  
      return
    }
    try{
      const checkAccessRule = await lessonAccessRulesService.getLessonAccessRule(lessonId);      
      if(checkAccessRule){
        await lessonAccessRulesService.editLessonAccessRule(lessonId,dataLessonAccessRule.data)
      }else{
        const newAccess: LessonAccessRuleType = { 
          lesson_id:lessonId,
          ...dataLessonAccessRule.data
        };
        await lessonAccessRulesService.createNewLessonAccessRule(newAccess)
      }  
      res.json({"success": true,"response": true})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async checkAccessLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    const studentId = parseInt(req.params.studentId)
    try{
    const accessRule = await lessonAccessRulesService.getLessonAccessRule(lessonId);
      if(accessRule){
        if(accessRule.rule_access == "L"){
          res.json({"success":true,"response":{"access":true}})
        }
        if(accessRule.rule_access == "D"){
          const infoStudent = await studentsService.getStudent(studentId)
          if(infoStudent){
            const days = accessRule.days_to_access
            const since = infoStudent.since
            //const sinceStudent = moment(since).format('YYYY-MM-DD');
            const sinceStudent = moment(since, 'YYYY-MM-DD');         
            const accessDate=sinceStudent.add(days, 'days').format('YYYY-MM-DD')           
            //const accessDate = moment(sinceStudent.add(days, 'days').format('YYYY-MM-DD'), 'YYYY-MM-DD');            
            const today = moment();
            if (moment(accessDate).isAfter(today)) {
              res.json({"success":true,"response":{access:false,dateAccess:accessDate,msg:""}})
            } else {
              res.json({"success":true,"response":{access:true,dateAccess:"",msg:""}})
            }
          }else{
            res.json({"success":true,"response":{access:false,dateAccess:"",msg:"Dados do aluno não encontrados!"}})
          }
        }
        if(accessRule.rule_access == "F"){
          const accessDate = accessRule.date_of_access
          const momentRule = moment(accessDate, 'YYYY-MM-DD');
          const today = moment();
          if (momentRule.isAfter(today)) {
            res.json({"success":true,"response":{access:false,dateAccess:accessDate,msg:""}})
          } else {
            res.json({"success":true,"response":{access:true,dateAccess:"",msg:""}})
          }         
        }
      }else{
        res.json({"success":true,"response":{access:true,dateAccess:"",msg:""}})
      }
    }catch(err){
      console.error(err)
      res.json({"error":err})
    }
  }

  async addCoursesCommunity(req:Request,res:Response){
    const courseId : number = parseInt(req.params.courseId)
    const studentsCommunity = await studentsService.studentsCommunity();





    return false
  }


}
export default new CatalogController();