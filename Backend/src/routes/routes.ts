import { Router } from 'express';
import routesAuth from './routesAuth';
import routesUsers from './routesUsers';

const routes = Router();
routesAuth(routes)
routesUsers(routes)
export default routes;