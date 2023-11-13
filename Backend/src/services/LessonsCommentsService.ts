import { redisDel, redisGet, redisSet } from "../config/redis"
import { NewCommentLessonType } from "../controllers/Dtos/courses.dto"
import { LessonsComments, LessonsCommentsInstance } from "../models/LessonsComments"
import { Students } from "../models/Students"
const { Op } = require('sequelize');

class LessonsCommentsService{
  async totalCommentsLesson(lessonId:number):Promise<number>{
    const redisKey = `totalCommentLesson:[${lessonId}]`
    const totalCommentsLessonRedis = await redisGet(redisKey)
    if(totalCommentsLessonRedis!=null){return totalCommentsLessonRedis}

    const totalLessons = await LessonsComments.count({
      where:{lesson_id:lessonId,public:1,status:1}
    })
    await redisSet(redisKey,totalLessons,60)
    return totalLessons
  }

  async getCommentsLesson(lessonId:number,page:number,studentId:number):Promise<LessonsCommentsInstance[]|null>{
    let redisKey = ""
    if(page<=10){
      redisKey = `commentsLesson:[${lessonId}];Page:[${page}]`
      console.log('get ',redisKey)
      const commentsLessonRedis = await redisGet(redisKey)
      if(commentsLessonRedis!=null){return commentsLessonRedis}
    }

    const pg = page -1
    const qtdRegPage = 30
    const offset = qtdRegPage * pg
    const listCommentsLesson = await LessonsComments.findAll({
      where:{lesson_id:lessonId,answers_comment_id:0,status:1, 
        [Op.or]: [ { public:1 },{ student_id: studentId }]
      },
      order:[['id','DESC']],
      offset:offset,
      limit:qtdRegPage,
      include:{attributes:['id','photo','name'],model: Students},
    })
    if(page<=10){ await redisSet(redisKey,listCommentsLesson,60)}
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
    const redisKey = `commentsPendingApproval:studentId[${commentsData.student_id}]:lessonId[${commentsData.lesson_id}]`
    await redisDel(redisKey)  
    await redisDel(`totalCommentLesson:[${commentsData.lesson_id}]`) 
    for(let i=1; i <= 10; i++){
      console.log(`remove key commentsAnswersLessons:comment[${commentsData.lesson_id}]:Page[${i}]`)
      await redisDel(`commentsLesson:[${commentsData.lesson_id}];Page:[${i}]`)
    }
 
    await LessonsComments.create({
      lesson_id:commentsData.lesson_id,
      student_id:commentsData.student_id,
      teacher_id:0,
      answers_comment_id:0,
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

  async getRecentCommentsStudent(studentId:number):Promise<LessonsCommentsInstance[]|null>{
    const redisKey = `recentStudentsComment:[${studentId}];`
    const getRecentCommentsStudent = await redisGet(redisKey)
    if(getRecentCommentsStudent!=null){return getRecentCommentsStudent}

    const recentStudentComments = await LessonsComments.findAll({
      where:{student_id:studentId,status:1},      
      order:[['id','DESC']],
      limit:5     
    })
    await redisSet(redisKey,recentStudentComments,60)
    return recentStudentComments
  }
}
export default new LessonsCommentsService()