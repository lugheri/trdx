import { Router } from "express";
import StudentsController from '../controllers/StudentsController'

export default (routes: Router) => {
  routes.post('/newStudent',StudentsController.newStudent)
  routes.get("/getStudent/:studentId", StudentsController.getStudent)
  routes.get("/lastStudentAccess/:studentId", StudentsController.lastStudentAccess)
  routes.patch("/EditStudent/:studentId", StudentsController.editStudent)
  routes.delete("/RemoveStudent/:studentId", StudentsController.removeStudent)
  routes.post("/listStudents", StudentsController.listStudents)
  routes.post("/searchStudents", StudentsController.searchStudent)
  //Courses
  routes.get('/studentsCourses/:studentId', StudentsController.studentsCourses)
  routes.get('/checkCourseStudent/:studentId/:courseId', StudentsController.checkCourseStudent)
  routes.get('/recentCommentsStudentsCourses/:studentId', StudentsController.recentCommentsStudentsCourses)
}