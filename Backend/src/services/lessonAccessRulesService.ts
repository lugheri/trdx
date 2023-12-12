import { redisDel, redisGet, redisSet } from "../config/redis";
import { LessonAccessRuleType } from "../controllers/Dtos/courses.dto";
import { LessonAccessRuleInstance, LessonAccessRules } from "../models/LessonAccessRules";

class LessonsAccessRulesService{
  async createNewLessonAccessRule(dataLessonAccessRule:LessonAccessRuleType):Promise<boolean|LessonAccessRuleInstance>{
    const [newLessonAccessRule,created] = await LessonAccessRules.findOrCreate({
      where: { lesson_id:dataLessonAccessRule.lesson_id},
      defaults:dataLessonAccessRule
    });
    console.info(created)
    return newLessonAccessRule.id ? newLessonAccessRule : false
  }
  
  async getLessonAccessRule(lessonId:number):Promise<LessonAccessRuleInstance|null>{
    const redisKey = `Lessons:AccessRule:[${lessonId}]`
    const getLessonAccessRuleRedis = await redisGet(redisKey)
   
    if(getLessonAccessRuleRedis!==null){ return getLessonAccessRuleRedis }

    const accessRule = await LessonAccessRules.findOne({
      where:{lesson_id:lessonId}
    })
    await redisSet(redisKey,accessRule)
    return accessRule
  }

  async editLessonAccessRule(lessonId:number,dataLessonAccessRule:LessonAccessRuleType):Promise<boolean>{  
    await redisDel(`Lessons:AccessRule:[${lessonId}]`)    
    await LessonAccessRules.update(dataLessonAccessRule,{where:{lesson_id:lessonId}})  
    return true;
  } 
}

export default new LessonsAccessRulesService();