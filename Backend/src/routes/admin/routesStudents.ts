import { Router } from "express";
import StudentsController from '../../controllers/StudentsController'

export default (routes: Router) => {
  routes.post('/newStudent',StudentsController.newStudent)
  routes.get("/getStudent/:studentId", StudentsController.getStudent)
  routes.get("/lastStudentAccess/:studentId", StudentsController.lastStudentAccess)
  routes.patch("/EditStudent/:studentId", StudentsController.editStudent)
  routes.delete("/RemoveStudent/:studentId", StudentsController.removeStudent)
  routes.post("/listStudents", StudentsController.listStudents)
  routes.post("/searchStudents", StudentsController.searchStudent)
  routes.get("/checkTypeStudentAccess/:studentId",StudentsController.checkCommunityStatusStudent)
  //Courses
  routes.get('/studentsCourses/:studentId', StudentsController.studentsCourses)
  routes.get('/checkCourseStudent/:studentId/:courseId', StudentsController.checkCourseStudent)
  routes.post('/addCourseStudent',StudentsController.addCourseStudent)
  routes.delete('/delCourseStudent/:idJoin',StudentsController.delCourseStudent)
  //Validity Contracts Courses
  routes.get('/validityContracts/:studentId/:courseId',StudentsController.validityContracts)
  routes.get('/activeContract/:studentId/:courseId',StudentsController.activeContract)
  routes.post('/addContract',StudentsController.addContract)
  routes.delete('/removeContract/:contractId',StudentsController.removeContract)

  routes.get('/recentCommentsStudentsCourses/:studentId', StudentsController.recentCommentsStudentsCourses)
}