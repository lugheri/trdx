import { Request, Response } from 'express';

import coursesService from "../services/coursesService"
import { CoursesDTO, CoursesPartialDTO, LessonAccessRuleDTO, LessonAccessRuleType, LessonAttachmentDTO, LessonAttachmentType, ModulesCourseDTO, ModulesLessonModuleDTO, PaginationCoursesDTO } from "./Dtos/courses.dto"
import courseModulesService from '../services/courseModulesService';
import coursesLessonsService from '../services/coursesLessonsService';
import LessonsAttachmentsService from '../services/LessonsAttachmentsService';
import lessonAccessRulesService from '../services/lessonAccessRulesService';
import moment from 'moment';
import studentsService from '../services/studentsService';
import { QuizQuestionDTO, QuizQuestionOptionsDTO, QuizQuestionSettingsDTO, QuizQuestionSettingsPartialDTO, QuizStudentAnswerDTO, StudentsQuizDTO } from './Dtos/quiz.dto';
import quizQuestionOptionsService from '../services/quizQuestionOptionsService';
import quizQuestionsService from '../services/quizQuestionsService';
import quizSettingsService from '../services/quizSettingsService';
import studentsQuizService from '../services/studentsQuizService';
import quizStudentsAnswersService from '../services/quizStudentsAnswersService';

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
        if(dataNewLesson.type_lesson == 'Quiz'){
          //New Settings
          const dataSettings = QuizQuestionSettingsDTO.safeParse({quiz_id:dataNewLesson.id})
          try{
            if(!dataSettings.success){
              res.json({"error":true,"message":dataSettings.error})
              return
            }
            await quizSettingsService.createNewSettings(dataSettings.data)
            res.json({"success": true,"response": dataNewLesson.id})  
            return
          }catch(err){
            console.error(err)
            res.json({"error":true,"message":err})  
          }    
        }
        res.json({"success": true,"response": dataNewLesson.id})  
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

  //Questions
  async newQuestion(req:Request,res:Response){
    const dataQuestion = QuizQuestionDTO.safeParse(req.body)
    if(!dataQuestion.success){
      res.json({"error":true,"message":dataQuestion.error})
      return
    }
    try{
      const dataNewQuestion = await quizQuestionsService.createNewQuestion(dataQuestion.data)
      if(dataNewQuestion){
        res.json({"success": true,"response": dataNewQuestion})  
        return
      }
      res.json({"error":true,"message":"Falha ao criar o nova Questão!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":true,"message":err})  
    } 
  }
  async getLastOrderQuestion(req:Request,res:Response){
    const quizId : number = parseInt(req.params.quiz_id)
    try{
      const lastOrderQuestion = await quizQuestionsService.lastOrderQuestion(quizId)
      res.json({"success": true,"response": lastOrderQuestion})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":true,"message":err})  
    }
  }
  async listQuestions(req:Request,res:Response){
    const quizId : number = parseInt(req.params.quiz_id)
    try{
      const listQuestion = await quizQuestionsService.listQuestions(quizId)
      res.json({"success": true,"response": listQuestion})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":true,"message":err})  
    }
  }
  async infoQuestions(req:Request,res:Response){
    const questionId : number = parseInt(req.params.question_id)
    try{
      const question = await quizQuestionsService.infoQuestion(questionId) 
      res.json({"success": true,"response": question})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async editQuestion(req:Request,res:Response){
    const questionId : number = parseInt(req.params.question_id)    
    const dataQuestion = QuizQuestionDTO.safeParse(req.body)
    if(!dataQuestion.success){
      res.json({"error": dataQuestion.error})  
      return
    }
    try{
      const edit = await quizQuestionsService.editQuestion(questionId, dataQuestion.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Options Questions
  async newOptionQuestion(req:Request,res:Response){
    const dataQuestionOption = QuizQuestionOptionsDTO.safeParse(req.body)
    if(!dataQuestionOption.success){
      res.json({"error":true,"message":dataQuestionOption.error})
      return
    }
    try{
      const dataNewOption = await quizQuestionOptionsService.createNewQuestionOptions(dataQuestionOption.data)
      if(dataNewOption){
        res.json({"success": true,"response": dataNewOption})  
        return
      }
      res.json({"error":true,"message":"Falha ao criar o opção de resposta!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    } 
  }
  async getLastOrderOption(req:Request,res:Response){
    const questionId : number = parseInt(req.params.question_id)
    try{
      const lastOrderOption = await quizQuestionOptionsService.lastOrderOptions(questionId)
      res.json({"success": true,"response": lastOrderOption})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":true,"message":err})  
    }
  }
  async listOptionsQuestion(req:Request,res:Response){
    const questionId : number = parseInt(req.params.question_id)
    try{
      const listOptionsQuestion = await quizQuestionOptionsService.listQuestionsOptions(questionId)
      res.json({"success": true,"response": listOptionsQuestion})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async infoOptionQuestion(req:Request,res:Response){
    const optionId : number = parseInt(req.params.option_id)
    try{
      const options = await quizQuestionOptionsService.infoQuestionOption(optionId) 
      res.json({"success": true,"response": options})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async editOptionQuestion(req:Request,res:Response){
    const optionId : number = parseInt(req.params.option_id)
    const dataOptionQuestion = QuizQuestionOptionsDTO.safeParse(req.body)
    if(!dataOptionQuestion.success){
      res.json({"error": dataOptionQuestion.error})  
      return
    }
    try{
      const edit = await quizQuestionOptionsService.editQuestionOption(optionId, dataOptionQuestion.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async editQuestionOptionByQuestionId(req:Request,res:Response){
    const questionId : number = parseInt(req.params.question_id)
    const dataOptionQuestion = QuizQuestionOptionsDTO.safeParse(req.body)
    if(!dataOptionQuestion.success){
      res.json({"error": dataOptionQuestion.error})  
      return
    }
    try{
      const edit = await quizQuestionOptionsService.editQuestionOptionByQuestionId(questionId, dataOptionQuestion.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Settings Questions
  async infoSettingsQuestion(req:Request,res:Response){
    const quiz_id : number = parseInt(req.params.quiz_id)
    try{
      const settings = await quizSettingsService.infoQuestionSettings(quiz_id) 
      res.json({"success": true,"response": settings})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":true,"message":err})  
    }
  }
  async editSettingsQuestion(req:Request,res:Response){
    const quiz_id : number = parseInt(req.params.quiz_id)
    const dataSettingsQuestion = QuizQuestionSettingsPartialDTO.safeParse(req.body)
    if(!dataSettingsQuestion.success){
      res.json({"error":true,"message":dataSettingsQuestion.error})  
      return
    }
    try{
      const edit = await quizSettingsService.editQuestionSettings(quiz_id,dataSettingsQuestion.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error('Erro >>',err)
      res.json({"error":true,"message":err})  
    }
  }

  //Students Page
  async nextQuestion(req:Request,res:Response){
    const quiz_id = parseInt(req.params.quiz_id)
    const last_question_id = parseInt(req.params.last_question_id)
    console.log("quiz_id",quiz_id)
    console.log("last_question_id",last_question_id)
    try{
      const nextQuestion = await quizQuestionsService.nextQuestion(quiz_id,last_question_id)
      res.json({"success": true,"response": nextQuestion})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err}) 
    }
  }

  async previousQuestion(req:Request,res:Response){
    const quiz_id = parseInt(req.params.quiz_id)
    const next_question_id = parseInt(req.params.next_question_id)
    console.log("quiz_id",quiz_id)
    console.log("next_question_id",next_question_id)
    try{
      const previousQuestion = await quizQuestionsService.previousQuestion(quiz_id,next_question_id)
      res.json({"success": true,"response": previousQuestion})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":true,"message":err}) 
    }
  }

  async answerQuestion(req:Request,res:Response){
    const dataAnswer = QuizStudentAnswerDTO.safeParse(req.body)
    if(!dataAnswer.success){
      res.json({"error":true,"message":dataAnswer.error})
      return
    }
    try{
      const answer = await quizStudentsAnswersService.newAnswerQuizStudent(dataAnswer.data)
      if(answer){
        res.json({"success": true,"response": answer})  
        return
      }
      res.json({"error":true,"message":"Falha ao salvar dados!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    } 
  }

  async infoAnswerQuestion(req:Request,res:Response){
    const question_id : number = parseInt(req.params.question_id)
    const student_id : number = parseInt(req.params.student_id)
    try{
      const infoAnswer = await quizStudentsAnswersService.infoQuizStudentAnswer(question_id,student_id)
      res.json({"success": true,"response": infoAnswer})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":true,"message":err})  
    }
  }
  async editAnswerQuestion(req:Request,res:Response){
    const question_id : number = parseInt(req.params.question_id)
    const student_id : number = parseInt(req.params.student_id)
    const dataAnswer = QuizStudentAnswerDTO.safeParse(req.body)
    if(!dataAnswer.success){
      res.json({"error":true,"message":dataAnswer.error})  
      return
    }
    try{
      const edit = await quizStudentsAnswersService.editQuizStudentAnswer(question_id,student_id,dataAnswer.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error('Erro >>',err)
      res.json({"error":true,"message":err})  
    }
  }

  async endQuiz(req:Request,res:Response){
    const dataEndQuiz = StudentsQuizDTO.safeParse(req.body)
    if(!dataEndQuiz.success){
      res.json({"error":true,"message":dataEndQuiz.error})
      return
    }
    try{
      const data = await studentsQuizService.createData(dataEndQuiz.data)
      if(data){
        res.json({"success": true,"response": data})  
        return
      }
      res.json({"error":true,"message":"Falha ao salvar dados!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    } 
  }


}
export default new CatalogController();