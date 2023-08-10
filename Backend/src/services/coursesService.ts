import { CoursesPartialType, CoursesType, PaginationCoursesType, SearchCoursesType } from "../controllers/Dtos/courses.dto";
import { Courses, CoursesInstance } from "../models/Courses"
import { Op } from "sequelize"

class CoursesService{
    async listCourses(pagination:PaginationCoursesType):Promise<CoursesInstance[]>{
    const p = pagination.page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    const listCourses = await Courses.findAll({
      where: {status: pagination.status},
      order:[[pagination.orderedBy,pagination.order]],
      offset:offset,
      limit:qtdRegPage
    })
    return listCourses
  } 

  async createNewCourse(dataCourse:CoursesType):Promise<boolean|CoursesInstance>{
    const [newCourse,created] = await Courses.findOrCreate({
      where: { name: dataCourse.name},
      defaults:dataCourse
    });
    return newCourse.id ? newCourse : false
  }

  async getCourse(courseId:number):Promise<boolean | CoursesInstance>{
    const course = await Courses.findByPk(courseId)
    return course ? course : false
  }  

  async editCourse(courseId:number,dataCourse:CoursesPartialType):Promise<boolean>{   
    await Courses.update(dataCourse,{where:{id:courseId}})   
    return true;
  }

}
export default new CoursesService();