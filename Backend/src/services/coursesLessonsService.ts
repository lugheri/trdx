import { redisDel, redisGet, redisSet } from "../config/redis";
import { sequelize } from "../instances/mysql";
import { Op } from "sequelize"
import { CoursesLessons, CoursesLessonsInstance } from "../models/CoursesLessons";
import { LessonsViewed } from "../models/LessonsViewed";
import { ModulesLessonModuleType } from "../controllers/Dtos/courses.dto";

class CoursesLessonsService{
  async lessonsCourse(courseId:number):Promise<number>{
    const redisKey=`Lessons:TotalLessonsCourse:[${courseId}]`
    const lessonsCourseRd = await redisGet(redisKey)
    if(lessonsCourseRd!==null){return lessonsCourseRd}

    const totalLessons = await CoursesLessons.count({
      where:{course_id:courseId,visibility:1,status:1}
    })
    await redisSet(redisKey,totalLessons)
    return totalLessons
  }
  async totalLessonsModule(moduleId:number):Promise<number>{
    const redisKey=`Lessons:TotalLessonsModule:[${moduleId}]`
    const lessonsCourseRd = await redisGet(redisKey)
    if(lessonsCourseRd!==null){return lessonsCourseRd}

    const totalLessons = await CoursesLessons.count({
      where:{module_id:moduleId,visibility:1,status:1}
    })
    await redisSet(redisKey,totalLessons)
    return totalLessons
  }

  async createNewLessonModule(dataLessonModule:ModulesLessonModuleType):Promise<null|CoursesLessonsInstance>{
    await redisDel(`Lessons:TotalLessonsCourse:[${dataLessonModule.course_id}]`)
    await redisDel(`Lessons:TotalLessonsModule:[${dataLessonModule.module_id}]`)
    await redisDel(`Lessons:LessonsModule:[${dataLessonModule.module_id}]`)

    const [newLessonModule,created] = await CoursesLessons.findOrCreate({
      where: { module_id: dataLessonModule.module_id, course_id:dataLessonModule.course_id, name:dataLessonModule.name,status:1},
      defaults:dataLessonModule
    });
    console.info(created)
    return newLessonModule.id ? newLessonModule : null
  }
  async lessonsModulesCourse(moduleId:number):Promise<CoursesLessonsInstance[]>{
    const redisKey=`Lessons:LessonsModule:[${moduleId}]`
    const lessonsModulesRD = await redisGet(redisKey)
    
    if(lessonsModulesRD!==null){return lessonsModulesRD}

    const lessonsModulesCourse = await CoursesLessons.findAll({
      where:{module_id:moduleId, status:1},      
      order:[['order','ASC']],
    })
    await redisSet(redisKey,lessonsModulesCourse)
    return lessonsModulesCourse
  }
  async firstLessonModule(moduleId:number){
    const lessonsModulesCourse = await CoursesLessons.findOne({
      where:{module_id:moduleId, status:1},      
      order:[['order','ASC']],
    })   
    return lessonsModulesCourse ? lessonsModulesCourse.id : 0
  }
  async nextLessonOrder(moduleId:number){
    const order = await CoursesLessons.findOne({
      attributes:['order'],
      where:{module_id:moduleId, status:1},      
      order:[['order','DESC']],
      limit:1
    })
    return order
  }
  async infoLesson(lessonId:number){
    const redisKey = `Lessons:infoLesson:[${lessonId}]`
    const infoLessonRedis = await redisGet(redisKey)
   
    if(infoLessonRedis!==null){ return infoLessonRedis }

    const infoLesson = await CoursesLessons.findByPk(lessonId)
    await redisSet(redisKey,infoLesson)
    return infoLesson
  }
  async editLessonModule(lessonId:number,dataLesson:ModulesLessonModuleType):Promise<boolean>{  
    await redisDel(`Lessons:TotalLessonsCourse:[${dataLesson.course_id}]`)
    await redisDel(`Lessons:TotalLessonsModule:[${dataLesson.module_id}]`)
    await redisDel(`Lessons:infoLesson:[${lessonId}]`)
    await redisDel(`Lessons:LessonsModule:[${dataLesson.module_id}]`)
    console.log(`Lessons:LessonsModule:[${dataLesson.module_id}]`)

    
    await CoursesLessons.update(dataLesson,{where:{id:lessonId}})  
    return true;
  } 

  
 

  async lessonsModule(courseId:number,moduleId:number,studentId:number):Promise<CoursesLessonsInstance[]>{
    const redisKey = `Lessons:lessonsModuleStudent:courseId[${courseId}]:moduleId[${moduleId}]:studentId[${studentId}]`
    const lessonsModuleRD = await redisGet(redisKey)
    if(lessonsModuleRD!==null){ return lessonsModuleRD }
    
    const lessonsModule = await CoursesLessons.findAll({
      where:{course_id:courseId,module_id:moduleId,visibility:1,status:1},
      order:[['order','ASC']],
      include:{attributes:['id','student_id'],model: LessonsViewed,required: false,  where: { student_id:studentId},}
    })
    await redisSet(redisKey,lessonsModule,30)
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