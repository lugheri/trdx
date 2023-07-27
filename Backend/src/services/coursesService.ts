import { CoursesType, PaginationCoursesType, SearchCoursesType } from "../controllers/Dtos/courses.dto";
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
  

}
export default new CoursesService();