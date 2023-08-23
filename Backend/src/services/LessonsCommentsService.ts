import { redisGet, redisSet } from "../config/redis"
import { NewCommentLessonType } from "../controllers/Dtos/courses.dto"
import { LessonsComments, LessonsCommentsInstance } from "../models/LessonsComments"
import { Students } from "../models/Students"

class LessonsCommentsService{
  async getCommentsLesson(lessonId:number,page:number):Promise<LessonsCommentsInstance[]|null>{
    const redisKey = `commentsLesson:[${lessonId}];Page:[${page}]`
    const commentsLessonRedis = await redisGet(redisKey)
    if(commentsLessonRedis!=null){return commentsLessonRedis}

    const pg = page -1
    const qtdRegPage = 30
    const offset = qtdRegPage * pg
    const listCommentsLesson = await LessonsComments.findAll({
      where:{lesson_id:lessonId,answers_comment_id:0,public:1,status:1},      
      order:[['id','DESC']],
      offset:offset,
      limit:qtdRegPage,
      include:{attributes:['id','photo','name'],model: Students},
    })
    await redisSet(redisKey,listCommentsLesson,60)
    return listCommentsLesson
  }

  async getCommentsAnswersLesson(commentId:number,page:number):Promise<LessonsCommentsInstance[]|null>{
    const redisKey = `commentsAnswersLessons:comment[${commentId}]:Page[${page}]`
    const commentsAnswersLesson = await redisGet(redisKey)
    if(commentsAnswersLesson!=null){return commentsAnswersLesson}

    const pg=page-1;
    const qtdRegPage = 5
    const offset = qtdRegPage * pg
    const listAnswers = await LessonsComments.findAll({
      where:{answers_comment_id:commentId,public:1,status:1},
      order:[['id','DESC']],
      offset:offset,
      limit:qtdRegPage,
      include:{attributes:['id','photo','name'],model: Students},
    })
    await redisSet(redisKey,listAnswers,60)
    return listAnswers
  }

  async newCommentLesson(commentsData:NewCommentLessonType){
    await LessonsComments.create({
      lesson_id:commentsData.lesson_id,
      student_id:commentsData.student_id,
      teacher_id:0,
      answer_comment_id:0,
      comment:commentsData.comment,
      public:0,
      status:1
    })
    return true;
  } 

  async commentsPendingApproval(studentId:number,lessonId:number){
    const redisKey = `commentsPendingApproval:studentId[${studentId}]:lessonId[${lessonId}]`
    const redisCommentsPendingApproval = await redisGet(redisKey)
    if(redisCommentsPendingApproval!=null){return redisCommentsPendingApproval}
   
    const commentsPendingApproval = await LessonsComments.findAll({
      where:{student_id:studentId,lesson_id:lessonId,public:0,status:1},
      order:[['id','DESC']]
    })
    await redisSet(redisKey,commentsPendingApproval,60)
    return commentsPendingApproval
  }
}
export default new LessonsCommentsService()