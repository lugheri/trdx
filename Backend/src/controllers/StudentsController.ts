import { Request,Response } from "express";
import studentsService from "../services/studentsService";
import { PaginationStudentDTO, SearchStudentDTO, StudentDTO, StudentPartialDTO } from "./Dtos/student.dto";
import studentCoursesServices from "../services/studentCoursesServices";
import LessonsCommentsService from "../services/LessonsCommentsService";


class StudentsController{
  async newStudent(req:Request, res:Response){ 
    const dataStudent = StudentDTO.safeParse(req.body)
    if(!dataStudent.success){
      res.json({"error":dataStudent.error})
      return
    }
    try{
      //Create a new credential
      const dataNewStudent = await studentsService.createNewStudent(dataStudent.data)
      if(dataNewStudent){
        res.json({"success": true,"response": dataNewStudent})  
        return
      }
      res.json({"error":"Falha ao criar o novo Aluno de acesso!"})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async getStudent(req:Request, res:Response){ 
    const studentId : number = parseInt(req.params.studentId)
    try{
      const student = await studentsService.getStudent(studentId)
      console.log(student)
      res.json({"success": true,"response": student})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async lastStudentAccess(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    try{
      const lastAccess = await studentsService.getLastAccessStudent(studentId)
      res.json({"success": true,"response": lastAccess})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
  
  async editStudent(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    const dataStudent = StudentPartialDTO.safeParse(req.body)
    if(!dataStudent.success){
      res.json({"error": dataStudent.error})  
      return
    }
    try{
      const edit = await studentsService.editStudent(studentId, dataStudent.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
  
  async removeStudent(req:Request, res:Response){ 
    const studentId : number = parseInt(req.params.studentId)
    try{
      await studentsService.removeStudent(studentId)
      res.json({"success": true})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
  
  async listStudents(req:Request, res:Response){
    const pagination = PaginationStudentDTO.safeParse(req.body)
    if(!pagination.success){
      res.json({"error": pagination.error})  
      return
    }  
    try{
      const listStudents = await studentsService.listStudent(pagination.data)
      res.json({"success": true,"response": listStudents})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async searchStudent(req:Request, res:Response){
    const searchParams = SearchStudentDTO.safeParse(req.body)
    if(!searchParams.success){
      res.json({"error": searchParams.error})  
      return
    }  
    try{
      const searchStudent = await studentsService.searchStudents(searchParams.data)
      res.json({"success": true,"response": searchStudent})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async studentsCourses(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    try{
      const courses = await studentCoursesServices.myCourses(studentId)
      console.log(courses)
      res.json({"success": true,"response": courses})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }

  async recentCommentsStudentsCourses(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    try{
      const comments = await LessonsCommentsService.getRecentCommentsStudent(studentId)
      console.log(comments)
      res.json({"success": true,"response": comments})  
      return
    }catch(err){
      console.log(err)
      res.json({"error":err})  
    }
  }
}
export default new StudentsController();