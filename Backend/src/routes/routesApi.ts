import { Router } from 'express';
import ApiController from '../controllers/ApiController';

export default (routes: Router) => {
  routes.get('/testApi',ApiController.checkHealth)
  routes.get('/api/webhook',ApiController.webhook)
}