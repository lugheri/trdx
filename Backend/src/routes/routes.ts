import { Router } from 'express';
import routesApi from './routesApi';
import routesAuth from './routesAuth';
// ::: A D M I N   A R E A  :::
// :: Dashboard
// :: Content
import routesHomeConfig from './admin/content/routesHomeConfig';
import routesCatalog from './admin/content/routesCatalog';
import routesComments from './admin/content/routesComments';
import routesTeachers from './admin/content/routesTeachers';
// :: Community
// :: Students
// :: Support
// :: Platform
import routesGallery from './admin/platform/routesGallery';
import routesIntegrations from './admin/platform/routesIntegrations';

// :: Metrics
// :: Setup






import routesStudents from './admin/routesStudents';
//PLATFORM
import routesClassRoom from './platform/routesClassRoom';
import routesSystem from './admin/routesSystem';
import routesUsers from './admin/routesUsers';
import routesProfileStudents from './platform/routesProfileStudent';
import routesSecurity from './admin/routesSecurity';

const routes = Router();
routesApi(routes)
routesAuth(routes)
// ::::::::::::::::::::::::::::::::::::::::::  A D M I N   A R E A  ::::::::::::::::::::::::::::::::::::::::::
// :: Dashboard
// :: Content
routesHomeConfig(routes)
routesCatalog(routes)
routesComments(routes)
routesTeachers(routes)
// :: Community
// :: Students
// :: Support
// :: Platform
routesGallery(routes)
routesIntegrations(routes)

// :: Metrics
// :: Setup





// ::::::::::::::::::::::::::::::::::::::::  S T U D E N T   A R E A  ::::::::::::::::::::::::::::::::::::::::




routesStudents(routes)
//PLATFORM
routesClassRoom(routes)




//Community
//Students
routesProfileStudents(routes)
//Support
//Platform
//Reports
//Configs
routesSystem(routes)
routesSecurity(routes)
routesUsers(routes)



export default routes;