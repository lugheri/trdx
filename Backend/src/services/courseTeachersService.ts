import {  redisDel, redisGet, redisSet } from "../config/redis";
import { TeacherType } from "../controllers/Dtos/teachers.dto";
import { CoursesTeachers, CoursesTeachersInstance } from "../models/CoursesTeachers";

class CourseTeacherService{
  async createNewTeacher(dataTeacher:TeacherType):Promise<boolean|CoursesTeachersInstance>{
    const [newTeacher,created] = await CoursesTeachers.findOrCreate({
      where: { name: dataTeacher.name},
      defaults:dataTeacher
    });
    console.info(created)
    await redisDel(`Teachers:listTeachers`)
    return newTeacher.id ? newTeacher : false
  }
  
  async infoTeacher(teacherId:number):Promise<boolean | CoursesTeachersInstance >{
    const redisKey = `Teachers:infoTeacher:[${teacherId}]`
    const infoTeacherRedis = await redisGet(redisKey)
    if(infoTeacherRedis!==null){ return infoTeacherRedis }   
    const teacher = await CoursesTeachers.findByPk(teacherId)
    const infoTeacher = teacher ? teacher : false
    await redisSet(redisKey,infoTeacher)
    return infoTeacher
  }  

  async listTeachers():Promise<CoursesTeachersInstance[]>{
    const redisKey=`Teachers:listTeachers`
    const listTeachersRd = await redisGet(redisKey)
    if(listTeachersRd!==null){return listTeachersRd}   

    const listTeachers = await CoursesTeachers.findAll({
      where: {status: 1},
    })
    await redisSet(redisKey,listTeachers,30)
    return listTeachers
  } 
 
  async editTeacher(teacherId:number,dataTeacher:TeacherType):Promise<boolean>{   
    await redisDel(`Teachers:listTeachers`)
    await redisDel(`Teachers:infoTeacher:[${teacherId}]`)
    await CoursesTeachers.update(dataTeacher,{where:{id:teacherId}})  
    return true;
  }


}
export default new CourseTeacherService()

