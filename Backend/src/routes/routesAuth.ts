import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middlewares/auth'
import IntegrationsController from '../controllers/IntegrationsController';

export default (routes: Router) => {
  routes.get('/live',AuthController.live)
  routes.post('/api/hotmart',IntegrationsController.apiHotmart)
  routes.post('/login',AuthController.login)
  routes.post('/loginStudent',AuthController.loginStudent)
  routes.use(authMiddleware);
  routes.get('/validation',AuthController.validation)
  routes.patch('/resetPass/:student_id',AuthController.resetPass)
  routes.post('/logout',AuthController.logout)
}