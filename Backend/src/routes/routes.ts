import { Router } from 'express';
import routesAuth from './routesAuth';
import routesSystem from './routesSystem';
import routesUsers from './routesUsers';
import routesStudents from './routesStudents';
import routesSecurity from './routesSecurity';

const routes = Router();
routesAuth(routes)
routesSecurity(routes)
routesSystem(routes)
routesUsers(routes)
routesStudents(routes)
export default routes;