import { sequelize } from "../instances/mysql"
import { NewNoteLessonType } from "../controllers/Dtos/courses.dto"
import { LessonsNotes, LessonsNotesInstance } from "../models/LessonsNotes"
import { redisGet, redisSet } from "../config/redis"
import { QueryTypes } from "sequelize"

class LessonsNotesService{
  async newNote(note:NewNoteLessonType):Promise<LessonsNotesInstance>{
    const newNote = await LessonsNotes.create(note)
    return newNote
  }

  async lessonsNotes(courseId:number,studentId:number,page:number):Promise<LessonsNotesInstance[]>{
    const redisKey=`listNotes:[courseId:[${courseId}],studentId:[${studentId}],page:[${page}]]`
    const listNotesCache = await redisGet(redisKey)
    if(listNotesCache!==null){return listNotesCache}
    console.log('>>>>>>>> page',page)
    const p = page-1
   
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    console.log('p',p,'offset',offset)
    const query = `
        SELECT n.id AS note_id, n.date_created, n.note, l.name AS lesson, m.module 
          FROM lessons_notes AS n 
          JOIN courses_lessons AS l ON n.lesson_id=l.id
          JOIN courses_modules AS m ON n.module_id=m.id
         WHERE n.course_id=${courseId} AND n.student_id=${studentId}
      ORDER BY n.date_created DESC LIMIT ${offset},${qtdRegPage};
    `
    const listNotes = await sequelize.query(query,{
      type: QueryTypes.SELECT
    }) as LessonsNotesInstance[]    
    await redisSet(redisKey,listNotes)
    return listNotes
  } 

  async editNotes(){}

  async deleteNotes(){}
}
export default new LessonsNotesService();