import { Request, Response } from 'express';

import coursesService from "../services/coursesService"
import { CommentLessonDTO, CoursesDTO, CoursesPartialDTO, ModulesCourseDTO, ModulesLessonModuleDTO, PaginationCoursesDTO } from "./Dtos/courses.dto"
import LessonsCommentsService from '../services/LessonsCommentsService';


class CommentsController{
  async totalComments(req:Request,res:Response){
    const type : string = req.params.type
    try{
      const totalComments =  type == 'news' ? await LessonsCommentsService.totalNewComments()
                              :  type == 'answered' ? await LessonsCommentsService.totalComments()
                              : await LessonsCommentsService.totalRemovedComments()     
      res.json({"success": true,"response": totalComments})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async getComments(req:Request,res:Response){
    const type : string = req.params.type
    const page : number = parseInt(req.params.page)   
    try{
      const comments = type == 'news' ? await LessonsCommentsService.getNewComments(page) 
                       :  type == 'answered' ? await LessonsCommentsService.getComments(page)
                       : await LessonsCommentsService.getRemovedComments(page)
      res.json({"success": true,"response": comments})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async getAnswers(req:Request,res:Response){
    const comment_id : number = parseInt(req.params.commentId)
    try{
      const answers = await LessonsCommentsService.getAnswers(comment_id)      
      res.json({"success": true,"response": answers})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async newAnswer(req:Request,res:Response){
    const dataAnswer = CommentLessonDTO.safeParse(req.body)
    if(!dataAnswer.success){
      res.json({"error":dataAnswer.error})
      return
    }
    try{
      const dataNewAnswer = await LessonsCommentsService.newAnswerComment(dataAnswer.data)
      if(dataNewAnswer){
        res.json({"success": true,"response": dataNewAnswer})  
        return
      }
      res.json({"error":"Falha ao criar o novo Curso!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }    
  }
  async infoComment(req:Request,res:Response){
    const commentId : number = parseInt(req.params.commentId)
    try{
      const infoComment = await LessonsCommentsService.infoComment(commentId)  
      res.json({"success": true,"response": infoComment})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async searchComment(req:Request,res:Response){
    const params : string = req.params.params
    const type : string = req.params.type
    try{
      const comments = type == 'news' ? await LessonsCommentsService.searchNewComments(params) 
                       :  type == 'answered' ? await LessonsCommentsService.searchComments(params) 
                       : await LessonsCommentsService.searchRemovedComments(params) 
                       
                       
      res.json({"success": true,"response": comments})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async editComment(req:Request,res:Response){
    const commentId : number = parseInt(req.params.commentId)
    const dataComment = CommentLessonDTO.safeParse(req.body)
    if(!dataComment.success){
      res.json({"error": dataComment.error})  
      return
    }
    try{
      const edit = await LessonsCommentsService.editComment(commentId, dataComment.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async getCommentsStudent(req:Request,res:Response){
    const studentId =parseInt(req.params.studentId)   
    try{
      const comments = await LessonsCommentsService.getRecentCommentsStudent(studentId)
      res.json({"success": true,"response": comments})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
}
export default new CommentsController();