import { Router } from "express";
import CatalogController from "../../../controllers/CatalogController";


export default (routes:Router)=>{
  //Courses
  routes.post("/newCourse",CatalogController.newCourse);
  routes.post("/listCourses",CatalogController.listCourses);
  routes.get("/infoCourse/:courseId",CatalogController.infoCourse);
  routes.patch("/editCourse/:courseId",CatalogController.editCourse);

  //Modules
  routes.post("/newModuleCourse",CatalogController.newModuleCourse);
  routes.get("/modulesCourse/:courseId",CatalogController.modulesCourse)  
  routes.get("/infoModuleCourse/:moduleId",CatalogController.infoModuleCourse);
  routes.patch("/editModuleCourse/:moduleId",CatalogController.editModuleCourse);


  //Lessons
  routes.post("/newLessonModule",CatalogController.newLessonModule);
  routes.get("/lessonsModule/:moduleId",CatalogController.lessonsModule)  
  routes.get("/infoLesson/:lessonId",CatalogController.infoLessonModule);
  routes.patch("/editLessonModule/:lessonId",CatalogController.editLessonModule);

  //Attachments
  //Attachments
  routes.get("/getAttachmentsLesson/:lessonId",CatalogController.attachmentLesson)  

}