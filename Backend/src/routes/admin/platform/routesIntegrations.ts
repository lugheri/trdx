import { Router } from "express";
import IntegrationsController from "../../../controllers/IntegrationsController";

export default (routes:Router)=>{
  //INTEGRATIONS
  routes.post('/newPlatformIntegration',IntegrationsController.newPlatformIntegration)
  routes.get('/listPlatformIntegration/:status',IntegrationsController.listPlatformIntegration)
  routes.get('/infoPlatformIntegration/:integration_id',IntegrationsController.infoPlatformIntegration)
  routes.patch('/editPlatformIntegration/:integration_id',IntegrationsController.editPlatformIntegration)
  
  //Products
  routes.post('/newProduct',IntegrationsController.newProduct)
  routes.get('/listProducts/:integration/:status',IntegrationsController.listProducts)
  routes.get('/infoProduct/:product_id',IntegrationsController.infoProduct)
  routes.patch('/editProduct/:product_id',IntegrationsController.editProduct)
  routes.delete('/deleteProduct/:product_id',IntegrationsController.deleteProduct)

  //Offers
  routes.post('/newOffer',IntegrationsController.newOffer)
  routes.get('/listOffers/:product_id/:status',IntegrationsController.listOffers)
  routes.get('/infoOffer/:offer_id',IntegrationsController.infoOffer)
  routes.patch('/editOffer/:offer_id',IntegrationsController.editOffer)
  routes.delete('/deleteOffer/:offer_id',IntegrationsController.deleteOffer)

  //Courses
  routes.post('/newCoursePlatform',IntegrationsController.newCourse)
  routes.get('/listCoursePlatform/:product_id/:offer_id',IntegrationsController.listCourse)
  routes.get('/infoCourseStudentPlatform/:offer_id/:course_id_students',IntegrationsController.infoCourseStudentPlatform)
  routes.patch('/editCoursePlatform/:course_id',IntegrationsController.editCourse)
  routes.delete('/deleteCoursePlatform/:course_id',IntegrationsController.deleteCourse)


  //Emails

}