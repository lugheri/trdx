import { Router } from 'express';
import routesAuth from './routesAuth';
import routesCourses from './routesCourses';
import routesSystem from './routesSystem';
import routesUsers from './routesUsers';
import routesStudents from './routesStudents';
import routesSecurity from './routesSecurity';

const routes = Router();
routesAuth(routes)
routesSecurity(routes)
routesSystem(routes)
routesUsers(routes)
routesCourses(routes)
routesStudents(routes)
export default routes;