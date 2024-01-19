import { Router } from "express";
import StudentsController from '../../../controllers/StudentsController'

export default (routes: Router) => {
  //CRUD STUDENTS
  routes.post('/newStudent',StudentsController.newStudent)
  routes.get("/getStudent/:studentId", StudentsController.getStudent)
  routes.patch("/EditStudent/:studentId", StudentsController.editStudent)
  routes.delete("/RemoveStudent/:studentId", StudentsController.removeStudent)
  routes.get("/listStudents/:status/:page/:filterType/:orderedBy/:order", StudentsController.listStudents)
  
  
  //Search and Info
  routes.get("/totalStudents/:status", StudentsController.totalStudents)
  routes.get("/lastStudentAccess/:studentId", StudentsController.lastStudentAccess)
  routes.get("/searchParams/:status/:searchParams/:page/:filterType/:orderedBy/:order", StudentsController.searchStudent)
  routes.post("/searchStudents", StudentsController.searchStudent)
  routes.get("/checkTypeStudentAccess/:studentId",StudentsController.checkCommunityStatusStudent)

  //Provisory
  routes.get("/resetPass/:studentId",StudentsController.resetPass)
  
  //Courses
  routes.get("/totalMyCourses/:studentId",StudentsController.totalMyCourses)
  routes.get('/studentsCourses/:studentId', StudentsController.studentsCourses)
  routes.get('/checkCourseStudent/:studentId/:courseId', StudentsController.checkCourseStudent)
  routes.post('/addCourseStudent',StudentsController.addCourseStudent)
  routes.delete('/delCourseStudent/:idJoin',StudentsController.delCourseStudent)

  //Views Lessons
  routes.get("/allLessonsViews/:studentId",StudentsController.allLessonsViews)

  //Send Presence
  routes.post("/sendPresence",StudentsController.sendPresence)












  
  
 
 
  
  //Courses
  
  

  //Validity Contracts Courses
  routes.get('/validityContracts/:studentId/:courseId',StudentsController.validityContracts)
  routes.get('/activeContract/:studentId/:courseId',StudentsController.activeContract)
  routes.post('/addContract',StudentsController.addContract)
  routes.delete('/removeContract/:contractId',StudentsController.removeContract)

  routes.get('/recentCommentsStudentsCourses/:studentId', StudentsController.recentCommentsStudentsCourses)
}