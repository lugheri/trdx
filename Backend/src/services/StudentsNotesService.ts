import { sequelize } from "../instances/mysql"
import { NoteStudentsType } from "../controllers/Dtos/courses.dto"
import { StudentsNotes } from "../models/StudentsNotes"
import { redisDel, redisGet, redisSet } from "../config/redis"
import { QueryTypes } from "sequelize"

class LessonsNotesService{
  async studentsNotes(courseId:number,studentId:number):Promise<string>{
    const redisKey=`noteStudent:[courseId:[${courseId}],studentId:[${studentId}]]`
    const noteStudentRd = await redisGet(redisKey)
    if(noteStudentRd!==null){return noteStudentRd}

    const noteStudent = await StudentsNotes.findOne({
      attributes: ['note'],
      where:{student_id:studentId,course_id:courseId}
    })
    const note = noteStudent ? noteStudent.note : ""
    await redisSet(redisKey,note)
    return note
  } 

  async editNote(note:NoteStudentsType){
    const redisKey=`noteStudent:[courseId:[${note.course_id}],studentId:[${note.student_id}]]`
    await redisSet(redisKey,note.note)
    const [newView,created] = await StudentsNotes.findCreateFind({
      where: { student_id : note.student_id, course_id : note.course_id},
      defaults: note
    });
    await StudentsNotes.update(note,{where:{student_id : note.student_id, course_id : note.course_id}})   
    return true;
  }

  

  async lessonsNotes(courseId:number,studentId:number,page:number):Promise<any[]>{
    const redisKey=`listNotes:[courseId:[${courseId}],studentId:[${studentId}],page:[${page}]]`
    const listNotesCache = await redisGet(redisKey)
    if(listNotesCache!==null){return listNotesCache}
    console.log('>>>>>>>> page',page)
    const p = page-1
   
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    console.log('p',p,'offset',offset)
    const query = `
        SELECT n.id AS note_id, n.date_created, n.note, l.id as lesson_id, l.name AS lesson, m.module 
          FROM lessons_notes AS n 
          JOIN courses_lessons AS l ON n.lesson_id=l.id
          JOIN courses_modules AS m ON n.module_id=m.id
         WHERE n.course_id=${courseId} AND n.student_id=${studentId}
      ORDER BY n.date_created DESC LIMIT ${offset},${qtdRegPage};
    `
    const listNotes = await sequelize.query(query,{
      type: QueryTypes.SELECT
    }) as any[]    
    await redisSet(redisKey,listNotes)
    return listNotes
  } 

  

 
}
export default new LessonsNotesService();