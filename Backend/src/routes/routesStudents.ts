import { Router } from "express";
import { StudentsController } from '../controllers/students'

export default (routes: Router) => {
  routes.post('/newStudent',StudentsController.create)
  routes.get('/listStudents/:status/:page',StudentsController.list)
  routes.post('/searchStudents',StudentsController.search)
  routes.get('/infoStudents/:id',StudentsController.info)
  routes.patch('/editStudents/:id',StudentsController.edit)
  routes.delete('/removeStudents/:id',StudentsController.remove)
}