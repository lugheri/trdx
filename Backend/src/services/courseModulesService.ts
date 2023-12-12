import { redisDel, redisGet, redisSet } from "../config/redis";
import { ModulesCourseType } from "../controllers/Dtos/courses.dto";
import { CoursesModules, CoursesModulesInstance } from "../models/CoursesModules";

class CourseModulesService{
  async createNewModuleCourse(dataModuleCourse:ModulesCourseType):Promise<boolean|CoursesModulesInstance>{
    const redisKey=`Modules:listModules:courseId[${dataModuleCourse.course_id}]`
    await redisDel(redisKey)

    const [newModuleCourse,created] = await CoursesModules.findOrCreate({
      where: { module: dataModuleCourse.module, course_id:dataModuleCourse.course_id},
      defaults:dataModuleCourse
    });
    console.info(created)
    return newModuleCourse.id ? newModuleCourse : false
  }

  async modulesCourse(courseId:number):Promise<CoursesModulesInstance[]>{
    const redisKey=`Modules:listModules:courseId[${courseId}]`
    const modulesCourseRd = await redisGet(redisKey)
    if(modulesCourseRd!==null){return modulesCourseRd}

    const modulesCourse = await CoursesModules.findAll({
      where:{course_id:courseId, status:1},      
      order:[['order','ASC']],
    })
    return modulesCourse
  }

  async infoModuleCourse(moduleId:number):Promise<boolean | CoursesModulesInstance>{
    const redisKey=`Module:infoModuleCourse:[${moduleId}]`
    const getCourseRd = await redisGet(redisKey)
    if(getCourseRd!==null){return getCourseRd}
    const module = await CoursesModules.findByPk(moduleId)
    await redisSet(redisKey,module ? module : null)
    return module ? module : false
  }  

  async editModuleCourse(moduleId:number,dataModule:ModulesCourseType):Promise<boolean>{   
    console.log(dataModule)
    const redisKey=`Module:infoModuleCourse:[${moduleId}]`
    const redisListKey=`Modules:listModules:courseId[${dataModule.course_id}]`
    await redisDel(redisKey)
    await redisDel(redisListKey)
    await CoursesModules.update(dataModule,{where:{id:moduleId}})  
    return true;
  }

  
}


export default new CourseModulesService();