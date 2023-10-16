import { redisGet, redisSet } from "../config/redis";
import { sequelize } from "../instances/mysql";
import { Op } from "sequelize"
import { CoursesLessons, CoursesLessonsInstance } from "../models/CoursesLessons";
import { LessonsViewed } from "../models/LessonsViewed";

class CoursesLessonsService{
  async infoLesson(lessonId:number){
    const redisKey = `infoLesson:[${lessonId}]`
    const infoLessonRedis = await redisGet(redisKey)
    if(infoLessonRedis!==null){ return infoLessonRedis }

    const infoLesson = await CoursesLessons.findByPk(lessonId)
    await redisSet(redisKey,infoLesson)
    return infoLesson
  }

  async lessonsCourse(courseId:number):Promise<number>{
    const totalLessons = await CoursesLessons.count({
      where:{course_id:courseId,visibility:1,status:1}
    })
    return totalLessons
  }

  async totalLessonsModule(moduleId:number):Promise<number>{
    const totalLessons = await CoursesLessons.count({
      where:{module_id:moduleId,visibility:1,status:1}
    })
    return totalLessons
  }

  async lessonsModule(courseId:number,moduleId:number,studentId:number):Promise<CoursesLessonsInstance[]>{
    const lessonsModule = await CoursesLessons.findAll({
      where:{course_id:courseId,module_id:moduleId,visibility:1,status:1},
      order:[['order','ASC']],
      include:{attributes:['id','student_id'],model: LessonsViewed,required: false,  where: { student_id:studentId},}
    })
    return lessonsModule
  }

 

  async nextLessonCourse(courseId:number,orderLastLesson:number){
    const nextLesson = await CoursesLessons.findOne({
      attributes:['id','module_id'],
      where:{order: { [Op.gt]: orderLastLesson },course_id:courseId,visibility:1,status:1},
      order:[['order','ASC']]
    })
    return nextLesson 
  }
}

export default new CoursesLessonsService();