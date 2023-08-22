import { Router } from "express";
import CoursesController from "../controllers/CoursesController";

export default (routes:Router)=>{
  routes.post("/listCourses",CoursesController.listCourses);
  routes.post("/newCourse",CoursesController.newCourse)
  routes.get("/infoCourse/:courseId",CoursesController.infoCourse)
  routes.patch("/editCourse/:courseId",CoursesController.editCourse)

  //Manager Course
  

  //Students Routes
  routes.get("/myCourses/:studentId",CoursesController.myCourses)
  routes.get("/validityCourse/:courseId/:studentId",CoursesController.validityCourse)
  routes.get("/progressCourse/:courseId/:studentId",CoursesController.progressCourse)
  routes.get("/progressModule/:moduleId/:studentId",CoursesController.progressModule)
  routes.get("/modulesMyCourse/:courseId",CoursesController.modulesMyCourse)
  routes.get("/lessonsModule/:courseId/:moduleId/:studentId",CoursesController.lessonsModule)
  routes.get("/infoLesson/:lessonId",CoursesController.infoLesson)
  //LessonActions
  routes.post("/watchedLesson",CoursesController.watchedLesson)
  routes.get("/getWatchedLesson/:studentId/:lessonId",CoursesController.getWatchedLesson)
  routes.delete("/watchedLesson/:studentId/:lessonId",CoursesController.removeWatchedLesson)
  routes.get("/nextLesson/:studentId/:courseId",CoursesController.nextLesson)
  
  routes.patch("/ratingLesson/:studentId/:lessonId",CoursesController.ratingLesson)

  //Tools
  //routes.get('/note')
  //routes.get('/savenote')


  //Comments
}