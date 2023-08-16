import { CoursesModules, CoursesModulesInstance } from "../models/CoursesModules";

class CourseModulesService{
  async modulesCourse(courseId:number):Promise<CoursesModulesInstance[]>{
    const modulesCourse = await CoursesModules.findAll({
      where:{course_id:courseId, visibility:1, status:1},      
      order:[['order','ASC']],
    })
    return modulesCourse
  }

}


export default new CourseModulesService();