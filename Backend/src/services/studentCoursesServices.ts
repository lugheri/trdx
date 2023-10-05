import { StudentsCourses, StudentsCoursesInstance } from "../models/StudentsCourses";
import { Courses, CoursesInstance } from "../models/Courses"
import { AddCourseStudentType } from "../controllers/Dtos/student.dto";

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
    const myCourses = await Courses.findAll({
      attributes: ['id','image','name'],
      group: ['id'],
      where: {published:1, status:1 },
      include: { attributes: [], model: StudentsCourses, where: { student_id:studentId},},     
    })
    return myCourses
  }

  async checkCourseStudent(studentId:number,courseId:number):Promise<number | boolean>{
    const check = await StudentsCourses.findAll({
      attributes: ['id'],
      where: {student_id:studentId,course_id:courseId, status:1 }, 
      limit:1    
    })
    return check.length == 1 ? check[0].id : false
  }

  async addCourseStudent(dataNewCourse:AddCourseStudentType):Promise<boolean>{
    await StudentsCourses.findOrCreate({
      where: { student_id: dataNewCourse.student_id,  course_id: dataNewCourse.course_id},
      defaults: dataNewCourse
    })
    return true
  }

  async delCourseStudent(idJoin:number):Promise<boolean>{
    await StudentsCourses.destroy({where: { id: idJoin}})
    return true
  }

 
 
}
export default new StudentCoursesService();