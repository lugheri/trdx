import { Router } from 'express';
import routesAuth from './routesAuth';
import routesCourses from './routesCourses';
import routesGallery from './routesGallery';
import routesSystem from './routesSystem';
import routesUsers from './routesUsers';
import routesStudents from './routesStudents';
import routesSecurity from './routesSecurity';
import routesAdminCommunity from './routesAdminCommunity';

const routes = Router();
routesAuth(routes)
routesSecurity(routes)
routesAdminCommunity(routes)
routesSystem(routes)
routesUsers(routes)
routesGallery(routes)
routesCourses(routes)
routesStudents(routes)


export default routes;