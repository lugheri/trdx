import { StudentsCourses, StudentsCoursesInstance } from "../models/StudentsCourses";
import { Courses, CoursesInstance } from "../models/Courses"

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

  async checkCourseStudent(studentId:number,courseId:number):Promise<boolean>{
    const check = await StudentsCourses.findAll({
      attributes: ['id'],
      where: {student_id:studentId,course_id:courseId, status:1 }, 
      limit:1    
    })
    return check.length == 1 ? true : false
  }


 
 
}
export default new StudentCoursesService();