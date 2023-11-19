import { redisDel, redisGet, redisSet } from "../config/redis";
import { RatingLessonType, WatchedLessonType } from "../controllers/Dtos/courses.dto";
import { sequelize } from "../instances/mysql";
import { LessonsViewed, LessonsViewedInstance } from "../models/LessonsViewed";

class LessonsViewedService{
  async lessonsViewed(studentId:number,courseId:number):Promise<number>{
    const redisKey = `lessonsViewedbyCourse:[studentId:[${studentId}],courseId:[${courseId}]]`
    const lessonViewedRedis = await redisGet(redisKey)
    if(lessonViewedRedis!==null){return lessonViewedRedis}

    const totalViewed = await LessonsViewed.count({
      where:{student_id:studentId,course_id:courseId}
    })
    await redisSet(redisKey,totalViewed,30)
    return totalViewed 
  }

  async lastLessonStudent(studentId:number):Promise<LessonsViewedInstance | null>{
    const redisKey = `nextLessonStudent:[${studentId}]`
    const nextLastStudentRedis = await redisGet(redisKey)
    if(nextLastStudentRedis!==null){ return nextLastStudentRedis}

    const results = await LessonsViewed.findOne({
      attributes:['course_id','module_id','lesson_id'],
      where:{student_id:studentId},
      order:[['id','DESC']]
    })

    if(!results) return null
    await redisSet(nextLastStudentRedis,results)
    return results;
  }

  async lessonsViewedByModule(studentId:number,moduleId:number):Promise<number>{
    const redisKey = `lessonsViewedByModule:[studentId:[${studentId}],moduleId:[${moduleId}]]`
    const lessonsViewedByModuleRedis = await redisGet(redisKey)
    if(lessonsViewedByModuleRedis!==null){return lessonsViewedByModuleRedis}

    const totalViewed = await LessonsViewed.count({
      where:{student_id:studentId,module_id:moduleId}
    })
    await redisSet(redisKey,totalViewed,30)
    return totalViewed 
  }

  async setViewedLesson(viewedData:WatchedLessonType){
    const [newView,created] = await LessonsViewed.findCreateFind({
      where: { student_id : viewedData.student_id, module_id : viewedData.module_id, lesson_id : viewedData.lesson_id},
      defaults: viewedData
    });
    await redisDel(`lessonsViewedbyCourse:[studentId:[${viewedData.student_id}],courseId:[${viewedData.course_id}]]`)
    await redisDel(`lessonsViewedByModule:[studentId:[${viewedData.student_id}],moduleId:[${viewedData.module_id}]]`)
    await redisDel(`nextLessonStudent:[${viewedData.student_id}]`)
    await redisSet(`lastLessonViewed:[studentId:[${viewedData.student_id}],courseId:[${viewedData.lesson_id}]]`,newView.id)
    await redisSet(`lessonViewed:[studentId:[${viewedData.student_id}],lessonId:[${viewedData.lesson_id}]]`,newView)
    console.info('New',newView)
    console.info('Created',created)
    return newView.id ? newView : false;
  }

  async removeViewedLesson(lessonId:number,studentId:number){
    await LessonsViewed.destroy({where:{ student_id : studentId, lesson_id : lessonId}})
    await redisDel(`lessonViewed:[studentId:[${studentId}],lessonId:[${lessonId}]]`)
    await redisDel(`nextLessonStudent:[${studentId}]`)
    return true;
  }

  async lessonStudentViewed(lessonId:number,studentId:number):Promise<LessonsViewedInstance|null>{
    const redisKey = `lessonViewed:[studentId:[${studentId}],lessonId:[${lessonId}]]`
    const lessonViewed = await redisGet(redisKey)
    if(lessonViewed!==null){return lessonViewed}

    const viewed = await LessonsViewed.findOne({
      where:{student_id:studentId,lesson_id:lessonId}
    })  
    await redisSet(redisKey,viewed,60)
    
    return viewed
  }

  async lastLessonViewed(studentId:number,courseId:number):Promise<number>{
    const redisKey=`lastLessonViewed:[studentId:[${studentId}],courseId:[${courseId}]]`
    const lastLessonViewed = await redisGet(redisKey)
    if(lastLessonViewed!==null){return lastLessonViewed}

    const lastLesson = await LessonsViewed.findOne({
      attributes: ['lesson_id'],
      where:{student_id:studentId,course_id:courseId},
      order:[['id','DESC']]
    })
    if(!lastLesson){return 0}
    await redisSet(redisKey,lastLesson.id)
    return lastLesson.lesson_id
  } 

  async setScoreLesson(lessonId:number,studentId:number,scoreData:RatingLessonType){
    await redisDel(`lessonViewed:[studentId:[${studentId}],lessonId:[${lessonId}]]`)
    await redisDel(`nextLessonStudent:[${studentId}]`)
    await LessonsViewed.update(scoreData,{where:{student_id:studentId,lesson_id:lessonId}})
    return true;
  }


}

export default new LessonsViewedService();