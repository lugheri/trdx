import { Router } from "express";
import CoursesController from "../controllers/CoursesController";

export default (routes:Router)=>{
  routes.post("/listCourses",CoursesController.listCourses);

}