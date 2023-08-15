import { sequelize } from "../instances/mysql";
import { LessonsViewed } from "../models/LessonsViewed";

class LessonsViewedService{
  async lessonsViewed(studentId:number,courseId:number):Promise<number>{
    const totalViewed = await LessonsViewed.count({
      where:{student_id:studentId,course_id:courseId}
    })
    return totalViewed 

  }
}

export default new LessonsViewedService();