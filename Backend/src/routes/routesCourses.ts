import { Router } from "express";
import CoursesController from "../controllers/CoursesController";

export default (routes:Router)=>{
  routes.post("/listCourses",CoursesController.listCourses);
  routes.post("/newCourse",CoursesController.newCourse)
  routes.get("/infoCourse/:courseId",CoursesController.infoCourse)
  routes.patch("/editCourse/:courseId",CoursesController.editCourse)
}