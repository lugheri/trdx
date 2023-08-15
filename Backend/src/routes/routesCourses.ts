import { Router } from "express";
import CoursesController from "../controllers/CoursesController";

export default (routes:Router)=>{
  routes.post("/listCourses",CoursesController.listCourses);
  routes.post("/newCourse",CoursesController.newCourse)
  routes.get("/infoCourse/:courseId",CoursesController.infoCourse)
  routes.patch("/editCourse/:courseId",CoursesController.editCourse)

  //Students Routes
  routes.get("/myCourses/:studentId",CoursesController.myCourses)
  routes.get("/validityCourse/:courseId/:studentId",CoursesController.validityCourse)
  routes.get("/progressCourse/:courseId/:studentId",CoursesController.progressCourse)
}