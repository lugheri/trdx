import { redisGet, redisSet } from "../config/redis"
import { LessonsAttachments, LessonsAttachmentsInstance } from "../models/LessonAttachments"


class LessonsAttachmentsService{
  async getAttachmentsLesson(lessonId:number):Promise<LessonsAttachmentsInstance[]|null>{
    const redisKey = `attachmentsLesson:[${lessonId}]`
    const commentsLessonRedis = await redisGet(redisKey)
    if(commentsLessonRedis!=null){return commentsLessonRedis}   
    const listAttachmentsLesson = await LessonsAttachments.findAll({
      where:{lesson_id:lessonId,status:1}
    })
    await redisSet(redisKey,listAttachmentsLesson,60)
    return listAttachmentsLesson
  }

}
export default new LessonsAttachmentsService()