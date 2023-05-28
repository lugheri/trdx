import { Router } from 'express';
import routesAuth from './routesAuth';
import routesSystem from './routesSystem';
import routesUsers from './routesUsers';
import routesStudents from './routesStudents';

const routes = Router();
routesAuth(routes)
routesSystem(routes)
routesUsers(routes)
routesStudents(routes)
export default routes;