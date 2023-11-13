import { Request, Response } from 'express';
import coursesService from '../services/coursesService';
import { PaginationCoursesDTO, SearchCoursesDTO, CoursesDTO, CoursesPartialDTO, WatchedLessonDTO, RatingLessonDTO, NewCommentLessonDTO, NoteStudentsDTO } from "./Dtos/courses.dto";
import studentCoursesServices from '../services/studentCoursesServices';
import coursesValidityContractsService from '../services/coursesValidityContractsService';
import coursesLessonsService from '../services/coursesLessonsService';
import lessonsViewedService from '../services/lessonsViewedService';
import { parseISO, isAfter, format } from 'date-fns';
import courseModulesService from '../services/courseModulesService';
import { CoursesLessonsInstance } from '../models/CoursesLessons';
import LessonsCommentsService from '../services/LessonsCommentsService';
import LessonsAttachmentsService from '../services/LessonsAttachmentsService';
import StudentsNotesService from '../services/StudentsNotesService';

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
      const checkStudentCourse = await studentCoursesServices.checkCourseStudent(studentId,courseId)
      if(checkStudentCourse==false){
        res.json({"success":true,"response":'not_have'})
        return
      }
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

  async progressStudent(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    const coursesStudents = await studentCoursesServices.myCourses(studentId)
    let totalLessons = 0
    let viewedLessons = 0
    for(const course of coursesStudents){
      const lessons = await coursesLessonsService.lessonsCourse(course.id)
      totalLessons += lessons
      viewedLessons += await lessonsViewedService.lessonsViewed(studentId,course.id)

      console.log('lessons course',course.id,'lessons',lessons) 
    }

    const progress = viewedLessons == 0 ? 0 : Math.round((viewedLessons/totalLessons)*100)  


    res.json({"success":true,"response":progress})
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

  async progressModule(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    const moduleId = parseInt(req.params.moduleId)
    try{
      const lessonsModule = await coursesLessonsService.totalLessonsModule(moduleId)
      const viewedLessons = await lessonsViewedService.lessonsViewedByModule(studentId,moduleId)
      const progress = viewedLessons == 0 ? 0 : Math.round((viewedLessons/lessonsModule)*100)      
      res.json({"success":true,"response":progress})
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async modulesCourse(req:Request,res:Response){
    const courseId = parseInt(req.params.courseId)
    try{
      const modulesCourse = await courseModulesService.modulesCourse(courseId);
      res.json({"success":true,"response":modulesCourse})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async lessonsModule(req:Request,res:Response){
    const courseId = parseInt(req.params.courseId)
    const moduleId = parseInt(req.params.moduleId)
    const studentId = parseInt(req.params.studentId)
    try{
      const lessonsModule = await coursesLessonsService.lessonsModule(courseId,moduleId,studentId);
      res.json({"success":true,"response":lessonsModule})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async infoLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    try{
      const infoLesson = await coursesLessonsService.infoLesson(lessonId);
      res.json({"success":true,"response":infoLesson})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async lastLessonViewed(req:Request,res:Response){
    const studentId = parseInt(req.params.studentId)
    try{
      const infoNextLesson = await lessonsViewedService.lastLessonStudent(studentId)
      if(!infoNextLesson){       
        res.json({"success":true,"response":null})
        return 
      }  
      const courseId = infoNextLesson.course_id
      const infoLesson: CoursesLessonsInstance = await coursesLessonsService.infoLesson(infoNextLesson.lesson_id)
      const order = infoLesson ? infoLesson.order : 0
      const  nextCourseLesson = await coursesLessonsService.nextLessonCourse(courseId,order)
      const nextLessonId = nextCourseLesson ? nextCourseLesson.id : infoNextLesson.lesson_id
      //Info Next Lesson
      res.json({"success": true,"response":nextLessonId})  
    }catch(err){
      console.log(err)
      res.json({"error":err})    
    }
  }
  
  async watchedLesson(req:Request,res:Response){
    const watch = WatchedLessonDTO.safeParse(req.body)
    if(!watch.success){
      res.json({"error": watch.error})  
      return
    }  
    try{
      await lessonsViewedService.setViewedLesson(watch.data) 
      res.json({"success": true,"response": watch.data.viewed})  
      return
    }catch(err){
      console.log(err)
      res.json({"error": err})  
    }
  }

  async removeWatchedLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    const studentId = parseInt(req.params.studentId)
    try{
      await lessonsViewedService.removeViewedLesson(lessonId,studentId)
      res.json({"success": true,"response":0})  
      return
    }catch(err){
      console.log(err)
      res.json({"error": err})  
    }
  }

  async getWatchedLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    const studentId = parseInt(req.params.studentId)
    try{
      const lesson = await lessonsViewedService.lessonStudentViewed(lessonId,studentId)      
      res.json({"success": true,"response":lesson})  
      return
    }catch(err){
      console.log(err)
      res.json({"error": err})  
    }
  }

  async continueCourse(req:Request,res:Response){
    const courseId = parseInt(req.params.courseId)
    const studentId = parseInt(req.params.studentId)
    try{
      const lastLesson = await lessonsViewedService.lastLessonViewed(studentId,courseId)
      const infoLesson: CoursesLessonsInstance = await coursesLessonsService.infoLesson(lastLesson)
      const order = infoLesson ? infoLesson.order : 0
      const  nextLesson = await coursesLessonsService.nextLessonCourse(courseId,order)
      res.json({"success": true,"response":{"lastLesson":lastLesson,
                                            "nextLesson":nextLesson ? nextLesson.id : 0,
                                            "module":nextLesson ? nextLesson.module_id : 0}})  
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async nextLesson(req:Request,res:Response){    
    //const studentId = parseInt(req.params.studentId)
    const courseId = parseInt(req.params.courseId)
    const lessonId = parseInt(req.params.lessonId)
    try{     
      const infoLesson: CoursesLessonsInstance = await coursesLessonsService.infoLesson(lessonId)
      const order = infoLesson ? infoLesson.order : 0
      const nextLesson = await coursesLessonsService.nextLessonCourse(courseId,order)
      res.json({"success": true,"response":{"lastLesson":lessonId,
                                            "nextLesson":nextLesson ? nextLesson.id : 0,
                                            "module":nextLesson ? nextLesson.module_id : 0}})  
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async ratingLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)
    const studentId = parseInt(req.params.studentId)
    const score = RatingLessonDTO.safeParse(req.body)
    if(!score.success){
      res.json({"error": score.error})  
      return
    }  
    try{
      await lessonsViewedService.setScoreLesson(lessonId,studentId,score.data) 
      res.json({"success": true,"response": score.data.score})  
      return
    }catch(err){
      console.log(err)
      res.json({"error": err})  
    }

  }


  //Attachment
  async attachmentLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId)    
    try{
      const attachmentsLesson = await LessonsAttachmentsService.getAttachmentsLesson(lessonId)
      res.json({"success":true,"response":attachmentsLesson})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  //Notes
  async studentsNotes(req:Request, res:Response){
    const courseId = parseInt(req.params.courseId)    
    const studentId = parseInt(req.params.studentId)    
    try{
      const notesCourse = await StudentsNotesService.studentsNotes(courseId,studentId)
      res.json({"success":true,"response":notesCourse})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }    
  }

  async editNote(req:Request, res:Response){
    const noteStudents = NoteStudentsDTO.safeParse(req.body)
    if(!noteStudents.success){
      res.json({"error": noteStudents.error})  
      return
    }  
    try{
      const note = await StudentsNotesService.editNote(noteStudents.data) 
      res.json({"success": true,"response": note})  
      return
    }catch(err){
      console.log(err)
      res.json({"error": err})  
    }
  }


  

  //Comments Lessons
  async totalCommentsLesson(req:Request, res:Response){
    const lessonId = parseInt(req.params.lessonId)
    try{
      const totalLessons = await LessonsCommentsService.totalCommentsLesson(lessonId)
      res.json({"success":true,"response":totalLessons})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }


  async commentsLesson(req:Request,res:Response){
    const lessonId = parseInt(req.params.lessonId);
    const page = parseInt(req.params.page)
    const studentId = parseInt(req.params.studentId)
    try{
      const commentsLessons = await LessonsCommentsService.getCommentsLesson(lessonId,page,studentId)
      res.json({"success":true,"response":commentsLessons})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async commentsAnswersLesson(req:Request,res:Response){
    const commentId = parseInt(req.params.commentId);
    const page = parseInt(req.params.page)
    try{
      const commentsAnswersLesson = await LessonsCommentsService.getCommentsAnswersLesson(commentId,page)
      res.json({"success":true,"response":commentsAnswersLesson})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

  async newCommentLesson(req:Request,res:Response){
    const commentsData = NewCommentLessonDTO.safeParse(req.body)
    if(!commentsData.success){
      res.json({"error": commentsData.error})  
      return
    }
    try{
      await LessonsCommentsService.newCommentLesson(commentsData.data) 
      res.json({"success": true,"response": true})  
      return
    }catch(err){
      console.log(err)
      res.json({"error": err})  
    }



  }
  async commentsPendingApproval(req:Request,res:Response){
    const studentId = parseInt(req.params.studentId)
    const lessonId = parseInt(req.params.lessonId)
    try{
      const commentsPendingApproval = await LessonsCommentsService.commentsPendingApproval(studentId,lessonId)
      res.json({"success":true,"response":commentsPendingApproval})
    }catch(err){
      console.log(err)
      res.json({"error":err})
    }
  }

}

export default new CoursesController();