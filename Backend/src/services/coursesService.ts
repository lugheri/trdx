import { redisDel, redisGet, redisSet } from "../config/redis";
import { CoursesPartialType, CoursesType, PaginationCoursesType } from "../controllers/Dtos/courses.dto";
import { Courses, CoursesInstance } from "../models/Courses"
//import { Op } from "sequelize"

class CoursesService{
  async createNewCourse(dataCourse:CoursesType):Promise<boolean|CoursesInstance>{
    const [newCourse,created] = await Courses.findOrCreate({
      where: { name: dataCourse.name},
      defaults:dataCourse
    });
    console.info(created)
    return newCourse.id ? newCourse : false
  }

  async listCourses(pagination:PaginationCoursesType):Promise<CoursesInstance[]>{
    const redisKey=`Course:listCourses:status[${pagination.status}],published:[${pagination.published}],orderedBy:[${pagination.orderedBy}],order:[${pagination.order}],page:[${pagination.page}]`
    const listCoursesRd = await redisGet(redisKey)
    if(listCoursesRd!==null){return listCoursesRd}

    const p = pagination.page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    const listCourses = await Courses.findAll({
      where: {status: pagination.status,published: pagination.published},
      order:[[pagination.orderedBy,pagination.order]],
      offset:offset,
      limit:qtdRegPage
    })
    await redisSet(redisKey,listCourses,30)
    return listCourses
  } 

  async getCourse(courseId:number):Promise<boolean | CoursesInstance>{
    const redisKey=`Course:getCourse:[${courseId}]`
    const getCourseRd = await redisGet(redisKey)
    if(getCourseRd!==null){return getCourseRd}
    const course = await Courses.findByPk(courseId)
    await redisSet(redisKey,course ? course : null)
    return course ? course : false
  }  

  async editCourse(courseId:number,dataCourse:CoursesPartialType):Promise<boolean>{  
    await redisDel(`Course:listCourses:status[1],published:[1],orderedBy:[order],order:[ASC],page:[1]`)
    await redisDel(`Course:listCourses:status[1],published:[0],orderedBy:[order],order:[ASC],page:[1]`)
    await redisDel(`Course:listCourses:status[0],published:[1],orderedBy:[order],order:[ASC],page:[1]`)
    await redisDel(`Course:listCourses:status[0],published:[0],orderedBy:[order],order:[ASC],page:[1]`) 
    await redisDel(`Course:listCourses:status[1],published:[1],orderedBy:[id],order:[ASC],page:[1]`)
    await redisDel(`Course:listCourses:status[1],published:[0],orderedBy:[id],order:[ASC],page:[1]`)
    await redisDel(`Course:listCourses:status[0],published:[1],orderedBy:[id],order:[ASC],page:[1]`)
    await redisDel(`Course:listCourses:status[0],published:[0],orderedBy:[id],order:[ASC],page:[1]`)
    await redisDel(`Course:getCourse:[${courseId}]`)
    await Courses.update(dataCourse,{where:{id:courseId}})  
    return true;
  }



}
export default new CoursesService();