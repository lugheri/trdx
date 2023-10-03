import { Router } from 'express';
import routesAuth from './routesAuth';
import routesCourses from './routesCourses';
import routesGallery from './routesGallery';
import routesSystem from './routesSystem';
import routesUsers from './routesUsers';
import routesStudents from './routesAdminStudents';
import routesSecurity from './routesSecurity';
import routesAdminCommunity from './routesAdminContent';
import routesAdminIntegrations from './routesAdminIntegrations';

const routes = Router();
routesAuth(routes)
//Content
routesCourses(routes)
//Community
routesAdminCommunity(routes)
//Students
routesStudents(routes)
//Support
//Platform
routesAdminIntegrations(routes)
routesGallery(routes)
//Reports
//Configs
routesSystem(routes)
routesSecurity(routes)
routesUsers(routes)



export default routes;