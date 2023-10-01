import { Router } from "express";
import StudentsController from '../controllers/StudentsController'

export default (routes: Router) => {
  routes.post('/newStudent',StudentsController.newStudent)
  routes.get("/getStudent/:studentId", StudentsController.getStudent)
  routes.patch("/EditStudent/:studentId", StudentsController.editStudent)
  routes.delete("/RemoveStudent/:studentId", StudentsController.removeStudent)
  routes.post("/listStudents", StudentsController.listStudents)
  routes.post("/searchStudents", StudentsController.searchStudent)
}