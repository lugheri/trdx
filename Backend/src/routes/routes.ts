import { Router } from 'express';
import routesAuth from './routesAuth';

const routes = Router();
routesAuth(routes)

export default routes;