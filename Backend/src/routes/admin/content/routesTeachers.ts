import { Router } from "express";
import TeacherController from "../../../controllers/TeacherController";


export default (routes:Router)=>{
  routes.post("/newTeacher",TeacherController.newTeacher);
  routes.get("/listTeachers",TeacherController.listTeachers);
  routes.get("/infoTeacher/:teacherId",TeacherController.infoTeacher);
  routes.patch("/editTeacher/:teacherId",TeacherController.editTeacher);

}