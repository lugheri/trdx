import { Request,Response } from "express";
import studentsService from "../services/studentsService";
import { AddContractValidityDTO, AddCourseStudentDTO, PaginationStudentDTO, SearchStudentDTO, StudentDTO, StudentPartialDTO } from "./Dtos/student.dto";
import studentCoursesServices from "../services/studentCoursesServices";
import LessonsCommentsService from "../services/LessonsCommentsService";
import coursesValidityContractsService from "../services/coursesValidityContractsService";
import lessonsViewedService from "../services/lessonsViewedService";
import md5 from 'md5';
import { redisGet, redisSet } from "../config/redis";

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
      console.error(err)
      res.json({"error":err})  
    }
  }
  async getStudent(req:Request, res:Response){ 
    const studentId : number = parseInt(req.params.studentId)
    try{
      const student = await studentsService.getStudent(studentId)
      res.json({"success": true,"response": student})  
      return
    }catch(err){
      console.error(err)
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
      console.error(err)
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
      console.error(err)
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
      console.error(err)
      res.json({"error":err})  
    }
  }  
  async listStudents(req:Request, res:Response){
    const status = parseInt(req.params.status)
    const page = parseInt(req.params.page);
    const filter = req.params.filterType == 'all' ? null : parseInt(req.params.filterType);
    const orderedBy = req.params.orderedBy
    const order = req.params.order as 'ASC'|'DESC'
    try{
      const listStudents = await studentsService.listStudent(status,page,filter,orderedBy,order);
      res.json({"success": true,"response": listStudents})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async searchStudent(req:Request, res:Response){
    const status = parseInt(req.params.status)
    const page = parseInt(req.params.page);
    const searchParams = req.params.searchParams;
    const filter = req.params.filterType == 'all' ? null : parseInt(req.params.filterType);
    const orderedBy = req.params.orderedBy
    const order = req.params.order as 'ASC'|'DESC'
    try{
      const listStudents = await studentsService.searchStudents(status,page,searchParams,filter,orderedBy,order);
      res.json({"success": true,"response": listStudents})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async totalStudents(req:Request, res:Response){
    const status = parseInt(req.params.status)
    try{
      const total = await studentsService.totalStudents(status)
      res.json({"success": true,"response": total})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async totalMembers(req:Request, res:Response){
    try{
      const total = await studentsService.totalCommunityMembers()
      res.json({"success": true,"response": total})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async searchStudentOld(req:Request, res:Response){
    const searchParams = SearchStudentDTO.safeParse(req.body)
    if(!searchParams.success){
      res.json({"error": searchParams.error})  
      return
    }  
    try{
      const searchStudent = await studentsService.searchStudentsOld(searchParams.data)
      
      res.json({"success": true,"response": searchStudent})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async checkCommunityStatusStudent(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    try{
      const communityStatusStudent = await studentsService.checkCommunityStatusStudent(studentId)
      res.json({"success": true,"response": communityStatusStudent})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

 

  async resetPass(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    try{
      const length = 6;
      const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_-+=<>?';
      let passwordHash = '';  
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        passwordHash += characters.charAt(randomIndex);
      }

      const newPass = passwordHash
      await studentsService.editStudent(studentId,{password:md5(newPass)})
      
      res.json({"success": true,"response": newPass})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  
  async studentsCourses(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    try{
      const courses = await studentCoursesServices.myCourses(studentId)
      res.json({"success": true,"response": courses})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async totalMyCourses(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    try{
      const total = await studentCoursesServices.totalMyCourses(studentId)
      res.json({"success": true,"response": total})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }


  async checkCourseStudent(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
    const courseId : number = parseInt(req.params.courseId)
    try{
      const checkCourse = await studentCoursesServices.checkCourseStudent(studentId,courseId)
      res.json({"success": true,"response": checkCourse})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async addCourseStudent(req:Request, res:Response){
    const dataNewCourse = AddCourseStudentDTO.safeParse(req.body)
    if(!dataNewCourse.success){
      res.json({"error":dataNewCourse.error})
      return
    }    
    try{
      const addCourseStudent = await studentCoursesServices.addCourseStudent(dataNewCourse.data)
      res.json({"success": true,"response": addCourseStudent})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async delCourseStudent(req:Request,res:Response){
    const idJoin:number = parseInt(req.params.idJoin)
    try{
      const del = await studentCoursesServices.delCourseStudent(idJoin)
      res.json({"success":true,"response":del})
      return
    }catch(err){
      res.json({"error":err})
    }
  }


  async allLessonsViews(req:Request, res:Response){
    const studentId = parseInt(req.params.studentId)
    try{
      const total = await lessonsViewedService.allLessonsStudentViewed(studentId)
      res.json({"success": true,"response": total})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  //Send Presence
  async sendPresence(req:Request,res:Response){
    const studentId = parseInt(req.body.studentId)
    const course = parseInt(req.body.course)
    const module = parseInt(req.body.module)
    const lesson = parseInt(req.body.lesson)
    type IPresence = [{
      student:number,
      course:number,
      module:number,
      lesson:number
    }]
    const activeSessions:IPresence|null = await redisGet('activeSessions')
    if(activeSessions === null){
      const sessions:IPresence = [{
        student:studentId,
        course:course,
        module:module,
        lesson:lesson
      }]
      await redisSet('activeSessions',sessions,60)
      res.json(true)
      return
    }

    const index = activeSessions.findIndex(student => student.student === studentId);
    if (index !== -1) {
      activeSessions[index].course = course;
      activeSessions[index].module = module;
      activeSessions[index].lesson = lesson;
    } else {
      const newStudent = {
        student: studentId,
        course: course,
        module: module, 
        lesson: lesson
      };    
      activeSessions.push(newStudent);
    }
    await redisSet('activeSessions',activeSessions,60)
    res.json(true)
    return
  }

  

  //Validity Contracts
  async activeContract(req:Request,res:Response){
    const studentId : number = parseInt(req.params.studentId)
    const courseId : number = parseInt(req.params.courseId)
    try{
      const activeContract = await coursesValidityContractsService.validityCourse(courseId,studentId)
      res.json({"success":true,"response":activeContract})
    }catch(err){
      res.json({"error":err})
    }
  }

  async validityContracts(req:Request,res:Response){
    const studentId : number = parseInt(req.params.studentId)
    const courseId : number = parseInt(req.params.courseId)
    try{
      const current = await coursesValidityContractsService.validityCourse(courseId,studentId)
      const contracts = await coursesValidityContractsService.allContrats(courseId,studentId)
      res.json({"success":true,"response":{"contracts":contracts,"currentContract":current}})
    }catch(err){
      res.json({"error":err})
    }
  }

  async addContract(req:Request,res:Response){
    const dataContract = AddContractValidityDTO.safeParse(req.body)
    if(!dataContract.success){
      res.json({"error":dataContract.error})
      return
    }
    try{
      const contract = await coursesValidityContractsService.addContract(dataContract.data)
      res.json({"success":true,"response":contract})
    }catch(err){
      res.json({"error":err})
    }

  }

  async removeContract(req:Request,res:Response){
    const contractId : number = parseInt(req.params.contractId)
    try{
      const del = await coursesValidityContractsService.removeContract(contractId)
      res.json({"success":true,"response":del})
    }catch(err){
      res.json({"error":err})
    }
  }

  async recentCommentsStudentsCourses(req:Request, res:Response){
    const studentId : number = parseInt(req.params.studentId)
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
export default new StudentsController();