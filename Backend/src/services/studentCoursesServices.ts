import { StudentsCourses, StudentsCoursesInstance } from "../models/StudentsCourses";
import { Courses, CoursesInstance } from "../models/Courses"
import { AddCourseStudentType } from "../controllers/Dtos/student.dto";
import { redisDel, redisGet, redisSet } from "../config/redis";

class StudentCoursesService{
  //Students Methods
 /* async myCourses(studentId:number):Promise<StudentsCoursesInstance[]>{
    const myCourses = await StudentsCourses.findAll({
      where: {student_id:studentId},
      include: { model: Courses, where: { published:1, status:1 },},     
    })
    return myCourses
  }*/

  async myCourses(studentId:number):Promise<CoursesInstance[]>{
    const redisKey = `myCourses:[${studentId}]`
    const myCoursesRedis = await redisGet(redisKey)
    if(myCoursesRedis!==null){ return myCoursesRedis }   

    const myCourses = await Courses.findAll({
      attributes: ['id','image','background_image','default_thumb','name'],
      group: ['id'],
      where: {published:1, status:1 },
      include: { attributes: [], model: StudentsCourses, where: { student_id:studentId},},     
    })
    await redisSet(redisKey,myCourses)
    return myCourses
  }

  async checkCourseStudent(studentId:number,courseId:number):Promise<number | boolean>{
    const redisKey = `checkCourseStudent:[${studentId}];courseId:[${courseId}]`
    const checkCourseStudent = await redisGet(redisKey)
    if(checkCourseStudent!==null){ return checkCourseStudent }   
    const check = await StudentsCourses.findAll({
      attributes: ['id'],
      where: {student_id:studentId,course_id:courseId, status:1 }, 
      limit:1    
    })
    await redisSet(redisKey,check.length == 1 ? check[0].id : false)
    return check.length == 1 ? check[0].id : false
  }

  async addCourseStudent(dataNewCourse:AddCourseStudentType):Promise<boolean>{
    await redisDel(`myCourses:[${dataNewCourse.student_id}]`)
    await StudentsCourses.findOrCreate({
      where: { student_id: dataNewCourse.student_id,  course_id: dataNewCourse.course_id},
      defaults: dataNewCourse
    })
    return true
  }

  async delCourseStudent(idJoin:number):Promise<boolean>{
    const dataJoin = await StudentsCourses.findByPk(idJoin)
    await redisDel(`myCourses:[${dataJoin?.student_id}]`)
    await redisDel(`checkCourseStudent:[${dataJoin?.student_id}];courseId:[${dataJoin?.course_id}]`)
    await StudentsCourses.destroy({where: { id: idJoin}})
    return true
  }

 
 
}
export default new StudentCoursesService();