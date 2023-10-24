import { Router } from 'express';
import routesAuth from './routesAuth';
//ADMIN
import routesIntegrations from './admin/routesIntegrations';
import routesContent from './admin/routesContent';
import routesStudents from './admin/routesStudents';
//PLATFORM
import routesCourses from './admin/routesCourses';
import routesClassRoom from './platform/routesClassRoom';
import routesGallery from './admin/routesGallery';
import routesSystem from './admin/routesSystem';
import routesUsers from './admin/routesUsers';
import routesProfileStudents from './platform/routesProfileStudent';

import routesSecurity from './admin/routesSecurity';

const routes = Router();
routesAuth(routes)
//ADMIN
routesIntegrations(routes)
routesContent(routes)
routesStudents(routes)
//PLATFORM
routesClassRoom(routes)



//Content
routesCourses(routes)
//Community
//Students
routesProfileStudents(routes)
//Support
//Platform
routesGallery(routes)
//Reports
//Configs
routesSystem(routes)
routesSecurity(routes)
routesUsers(routes)



export default routes;