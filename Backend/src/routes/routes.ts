import { Router } from 'express';
import routesAuth from './routesAuth';
import routesUsers from './routesUsers';
import routesStudents from './routesStudents';

const routes = Router();
routesAuth(routes)
routesUsers(routes)
routesStudents(routes)
export default routes;