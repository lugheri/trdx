import { redisDel, redisGet, redisSet } from "../config/redis"
import { LessonAttachmentType } from "../controllers/Dtos/courses.dto";
import { LessonsAttachments, LessonsAttachmentsInstance } from "../models/LessonAttachments"


class LessonsAttachmentsService{
  async createNewAttachmentsLesson(dataAttachmentsLesson:LessonAttachmentType):Promise<boolean|LessonsAttachmentsInstance>{
    const [newLessonAttachments,created] = await LessonsAttachments.findOrCreate({
      where: { lesson_id:dataAttachmentsLesson.lesson_id,name:dataAttachmentsLesson.name},
      defaults:dataAttachmentsLesson
    });
    await redisDel(`Lessons:AttachmentsLesson:[${dataAttachmentsLesson.lesson_id}]`)
    
    console.info(created)
    return newLessonAttachments.id ? newLessonAttachments : false
  }  

  async getAttachmentsLesson(lessonId:number):Promise<LessonsAttachmentsInstance[]|null>{
    const redisKey = `Lessons:AttachmentsLesson:[${lessonId}]`
    const attachmentsLessonRedis = await redisGet(redisKey)
    if(attachmentsLessonRedis!=null){return attachmentsLessonRedis}   
    const listAttachmentsLesson = await LessonsAttachments.findAll({
      where:{lesson_id:lessonId,status:1}
    })
    await redisSet(redisKey,listAttachmentsLesson,60)
    return listAttachmentsLesson
  }

  async infoAttachmentsLesson(attachmentId:number){
    const redisKey = `Lessons:infoAttachment:[${attachmentId}]`
    const infoAttachmentRedis = await redisGet(redisKey)
   
    if(infoAttachmentRedis!==null){ return infoAttachmentRedis }

    const infoAttachment = await LessonsAttachments.findByPk(attachmentId)
    await redisSet(redisKey,infoAttachment)
    return infoAttachment
  }
  
  async editAttachmentLesson(attachmentId:number,dataAttachmentsLesson:LessonAttachmentType):Promise<boolean>{  
    await redisDel(`Lessons:infoAttachment:[${attachmentId}]`) 
    await redisDel(`Lessons:AttachmentsLesson:[${dataAttachmentsLesson.lesson_id}]`)       
    await LessonsAttachments.update(dataAttachmentsLesson,{where:{id:attachmentId}})  
    return true;
  } 

  async deleteAttachmentLesson(attachmentId:number,lessonId:number){  
    await redisDel(`Lessons:infoAttachment:[${attachmentId}]`) 
    await redisDel(`Lessons:AttachmentsLesson:[${lessonId}]`)       
    await LessonsAttachments.destroy({where:{id:attachmentId}})  
    return true;
  } 

}
export default new LessonsAttachmentsService()