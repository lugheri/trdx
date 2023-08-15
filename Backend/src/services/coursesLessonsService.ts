import { sequelize } from "../instances/mysql";
import { CoursesLessons, CoursesLessonsInstance } from "../models/CoursesLessons";

class CoursesLessonsService{
  async lessonsCourse(courseId:number):Promise<number>{
    const totalLessons = await CoursesLessons.count({
      where:{course_id:courseId,visibility:1,status:1}
    })
    return totalLessons
    

  }
}

export default new CoursesLessonsService();