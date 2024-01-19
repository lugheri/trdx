import { IntegrationCoursesType } from "../controllers/Dtos/integration.dto";
import { IntegrationPlatformsCourses, IntegrationPlatformsCoursesInstance } from "../models/IntegrationPlatformsCourses";

class IntegrationCoursesService{
  async newCourse(dataCourse:IntegrationCoursesType):Promise<boolean | IntegrationPlatformsCoursesInstance>{
    const [newCourse,created] = await IntegrationPlatformsCourses.findOrCreate({
      where:{product_id:dataCourse.product_id,offer_id:dataCourse.offer_id,course_id_students:dataCourse.course_id_students},
      defaults:dataCourse
    })
    console.info(created)
    return newCourse.id ? newCourse : false
  }
  async getCoursesPlatform(product_id:number,offer_id:number){
    const listCoursesIntegrations = await IntegrationPlatformsCourses.findAll({
      where: {product_id:product_id,offer_id: offer_id},
    })
    return listCoursesIntegrations
  }
  async infoCourse(course_id:number){
    const infoCourse = await IntegrationPlatformsCourses.findByPk(course_id)
    return infoCourse
  }
  async infoCourseStudentPlatform(offer_id:number,course_id:number){
    const infoCourseStudentPlatform = await IntegrationPlatformsCourses.findOne({
      where: {offer_id:offer_id,course_id_students:course_id},
    })
    return infoCourseStudentPlatform
  }
  async editCourse(course_id:number,dataCourse:IntegrationCoursesType){
    await IntegrationPlatformsCourses.update(dataCourse,{where:{id:course_id}})
    return true;
  }
  async removeCourse(course_id:number){
    await IntegrationPlatformsCourses.destroy({where:{id:course_id}})
    return true;
  }
}
export default new IntegrationCoursesService();