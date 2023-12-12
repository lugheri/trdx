import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middlewares/auth'

export default (routes: Router) => {
  routes.get('/live',AuthController.live)  
  routes.get("/checkMailStudent/:mail",AuthController.checkMailStudent)
  routes.get("/resetPassLogin/:studentId/:mail",AuthController.resetPassLogin)
  routes.post('/login',AuthController.login)
  routes.post('/loginStudent',AuthController.loginStudent)
  routes.use(authMiddleware);
  routes.get('/validation',AuthController.validation)
  routes.patch('/resetPass/:student_id',AuthController.resetPass)//Logged
  routes.post('/logout',AuthController.logout)
}