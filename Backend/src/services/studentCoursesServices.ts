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
      attributes: ['id','image'],
      group: ['id'],
      where: {published:1, status:1 },
      include: { attributes: [], model: StudentsCourses, where: { student_id:studentId},},     
    })
    return myCourses
  }


 
 
}
export default new StudentCoursesService();