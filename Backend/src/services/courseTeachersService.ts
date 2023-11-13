import {  redisGet, redisSet } from "../config/redis";
import { CoursesTeachers, CoursesTeachersInstance } from "../models/CoursesTeachers";

class CourseTeacherService{
  
  async infoTeacher(teacherId:number):Promise<boolean | CoursesTeachersInstance >{
    const redisKey = `infoTeacher:[${teacherId}]`
    const infoTeacherRedis = await redisGet(redisKey)
    if(infoTeacherRedis!==null){ return infoTeacherRedis }   
    const teacher = await CoursesTeachers.findByPk(teacherId)
    const infoTeacher = teacher ? teacher : false
    await redisSet(redisKey,infoTeacher)
    return infoTeacher
  }


}
export default new CourseTeacherService()

