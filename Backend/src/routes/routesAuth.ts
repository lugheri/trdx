import { Router } from 'express';
import AuthController from '../controllers/AuthController';

export default (routes: Router) => {
  routes.get('/live',AuthController.live)
  routes.post('/login',AuthController.login)
}