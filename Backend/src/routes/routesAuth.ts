import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middlewares/auth'

export default (routes: Router) => {
  routes.get('/live',AuthController.live)
  routes.post('/login',AuthController.login)
  routes.use(authMiddleware);
  routes.get('/validation',AuthController.validation)
  routes.post('/logout',AuthController.logout)
}