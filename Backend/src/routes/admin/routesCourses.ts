import { Router } from "express";
import CoursesController from "../../controllers/CoursesController";

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
  routes.get("/infoLesson/:lessonId",CoursesController.infoLesson)
}