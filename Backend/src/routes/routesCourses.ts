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
  routes.get("/lessonsModule/:courseId/:moduleId",CoursesController.lessonsModule)
  routes.get("/infoLesson/:lessonId",CoursesController.infoLesson)
}