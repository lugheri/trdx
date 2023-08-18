import { sequelize } from "../instances/mysql";
import { CoursesLessons, CoursesLessonsInstance } from "../models/CoursesLessons";

class CoursesLessonsService{
  async infoLesson(lessonId:number){
    const infoLesson = await CoursesLessons.findByPk(lessonId)
    return infoLesson
  }

  async lessonsCourse(courseId:number):Promise<number>{
    const totalLessons = await CoursesLessons.count({
      where:{course_id:courseId,visibility:1,status:1}
    })
    return totalLessons
  }

  async totalLessonsModule(moduleId:number):Promise<number>{
    const totalLessons = await CoursesLessons.count({
      where:{module_id:moduleId,visibility:1,status:1}
    })
    return totalLessons
  }

  async lessonsModule(courseId:number,moduleId:number):Promise<CoursesLessonsInstance[]>{
    const lessonsModule = await CoursesLessons.findAll({
      where:{course_id:courseId,module_id:moduleId,visibility:1,status:1}
    })
    return lessonsModule
  }
}

export default new CoursesLessonsService();