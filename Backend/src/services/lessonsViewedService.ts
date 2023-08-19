import { RatingLessonType, WatchedLessonType } from "../controllers/Dtos/courses.dto";
import { sequelize } from "../instances/mysql";
import { LessonsViewed, LessonsViewedInstance } from "../models/LessonsViewed";

class LessonsViewedService{
  async lessonsViewed(studentId:number,courseId:number):Promise<number>{
    const totalViewed = await LessonsViewed.count({
      where:{student_id:studentId,course_id:courseId}
    })
    return totalViewed 
  }

  async lessonsViewedByModule(studentId:number,moduleId:number):Promise<number>{
    const totalViewed = await LessonsViewed.count({
      where:{student_id:studentId,module_id:moduleId}
    })
    return totalViewed 
  }

  async setViewedLesson(viewedData:WatchedLessonType){
    const [newView,created] = await LessonsViewed.findCreateFind({
      where: { student_id : viewedData.student_id, lesson_id : viewedData.lesson_id},
      defaults: viewedData
    });
    console.log('New',newView)
    console.log('Created',created)
    return newView.id ? newView : false;
  }

  async removeViewedLesson(lessonId:number,studentId:number){
    await LessonsViewed.destroy({where:{ student_id : studentId, lesson_id : lessonId}})
    return true;
  }

  async lessonStudentViewed(lessonId:number,studentId:number):Promise<LessonsViewedInstance|null>{
    const viewed = await LessonsViewed.findOne({
      where:{student_id:studentId,lesson_id:lessonId}
    })
    return viewed
  }

  async setScoreLesson(lessonId:number,studentId:number,scoreData:RatingLessonType){
    await LessonsViewed.update(scoreData,{where:{student_id:studentId,lesson_id:lessonId}})
    return true;
  }
}

export default new LessonsViewedService();