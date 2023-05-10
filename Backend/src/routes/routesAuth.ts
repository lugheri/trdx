import { Router } from 'express';
import AuthController from '../controllers/AuthController';

export default (routes: Router) => {
  routes.get('/live',AuthController.live)
}