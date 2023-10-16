import { Router } from "express";
import CoursesController from "../controllers/CoursesController";

export default (routes:Router)=>{
  //Manager Course
  routes.post("/listCourses",CoursesController.listCourses);
  routes.post("/newCourse",CoursesController.newCourse);
  routes.get("/infoCourse/:courseId",CoursesController.infoCourse);
  routes.patch("/editCourse/:courseId",CoursesController.editCourse);
  //Modules
  routes.get("/modulesCourse/:courseId",CoursesController.modulesCourse)
  
  //Lessons
  routes.get("/lessonsModule/:courseId/:moduleId/:studentId",CoursesController.lessonsModule)

  //Attachments
  routes.get("/getAttachmentsLesson/:lessonId",CoursesController.attachmentLesson)
 
  




  

  //Students Routes
  routes.get("/myCourses/:studentId",CoursesController.myCourses)
  routes.get("/validityCourse/:courseId/:studentId",CoursesController.validityCourse)
  routes.get("/progressCourse/:courseId/:studentId",CoursesController.progressCourse)
  routes.get("/progressModule/:moduleId/:studentId",CoursesController.progressModule)
 
  routes.get("/infoLesson/:lessonId",CoursesController.infoLesson)
  //LessonActions
  routes.post("/watchedLesson",CoursesController.watchedLesson)
  routes.get("/getWatchedLesson/:studentId/:lessonId",CoursesController.getWatchedLesson)
  routes.delete("/watchedLesson/:studentId/:lessonId",CoursesController.removeWatchedLesson)
  routes.get("/continueCourse/:studentId/:courseId",CoursesController.continueCourse)
  routes.get("/nextLesson/:studentId/:courseId/:lessonId",CoursesController.nextLesson)

  
  routes.patch("/ratingLesson/:studentId/:lessonId",CoursesController.ratingLesson)

  //Tools
  //routes.get('/note')
  //routes.get('/savenote')


  //Comments
  routes.get("/totalCommentsLesson/:lessonId",CoursesController.totalCommentsLesson)
  routes.get("/lessonsComments/:lessonId/:page",CoursesController.commentsLesson)
  routes.get("/lessonsCommentsAnswers/:commentId/:page",CoursesController.commentsAnswersLesson)
  routes.post("/newCommentLesson",CoursesController.newCommentLesson)
  routes.get("/commentsPendingApproval/:lessonId/:studentId",CoursesController.commentsPendingApproval)
}