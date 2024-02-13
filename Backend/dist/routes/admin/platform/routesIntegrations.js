"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IntegrationsController_1 = __importDefault(require("../../../controllers/IntegrationsController"));
exports.default = (routes) => {
    //INTEGRATIONS
    routes.post('/newPlatformIntegration', IntegrationsController_1.default.newPlatformIntegration);
    routes.get('/listPlatformIntegration/:status', IntegrationsController_1.default.listPlatformIntegration);
    routes.get('/infoPlatformIntegration/:integration_id', IntegrationsController_1.default.infoPlatformIntegration);
    routes.patch('/editPlatformIntegration/:integration_id', IntegrationsController_1.default.editPlatformIntegration);
    //Products
    routes.post('/newProduct', IntegrationsController_1.default.newProduct);
    routes.get('/listProducts/:integration/:status', IntegrationsController_1.default.listProducts);
    routes.get('/infoProduct/:product_id', IntegrationsController_1.default.infoProduct);
    routes.patch('/editProduct/:product_id', IntegrationsController_1.default.editProduct);
    routes.delete('/deleteProduct/:product_id', IntegrationsController_1.default.deleteProduct);
    //Offers
    routes.post('/newOffer', IntegrationsController_1.default.newOffer);
    routes.get('/listOffers/:product_id/:status', IntegrationsController_1.default.listOffers);
    routes.get('/infoOffer/:offer_id', IntegrationsController_1.default.infoOffer);
    routes.patch('/editOffer/:offer_id', IntegrationsController_1.default.editOffer);
    routes.delete('/deleteOffer/:offer_id', IntegrationsController_1.default.deleteOffer);
    //Courses
    routes.post('/newCoursePlatform', IntegrationsController_1.default.newCourse);
    routes.get('/listCoursePlatform/:product_id/:offer_id', IntegrationsController_1.default.listCourse);
    routes.get('/infoCourseStudentPlatform/:offer_id/:course_id_students', IntegrationsController_1.default.infoCourseStudentPlatform);
    routes.patch('/editCoursePlatform/:course_id', IntegrationsController_1.default.editCourse);
    routes.delete('/deleteCoursePlatform/:course_id', IntegrationsController_1.default.deleteCourse);
    //History Hooks
    routes.get('/listHooks/:page/:integration/:product_id', IntegrationsController_1.default.listHooks);
    routes.get('/infoHooks/:hook_id', IntegrationsController_1.default.infoHooks);
    //Emails Copys
    routes.post('/newCopy', IntegrationsController_1.default.newCopy);
    routes.get('/listCopys', IntegrationsController_1.default.listCopys);
    routes.get('/infoCopy/:copy_id', IntegrationsController_1.default.infoCopy);
    routes.patch('/editCopy/:copy_id', IntegrationsController_1.default.editCopy);
    routes.delete('/deleteCopy/:copy_id', IntegrationsController_1.default.deleteCopy);
    routes.post('/sendTestCopy', IntegrationsController_1.default.sendTestCopy);
};
