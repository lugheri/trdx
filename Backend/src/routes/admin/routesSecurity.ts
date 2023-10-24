import { Router } from "express";
import SecurityController from "../../controllers/SecurityController";

export default (routes : Router) => {
  /*routes.get("/getModulesLevel/:levelId",SecurityController.getModuleLevel);*/
  routes.get("/modules/:type/:moduleParentId/:levelId",SecurityController.getModules)
  routes.get("/subModules/:type/:module/:levelId",SecurityController.subModules)
  routes.get("/checkAccess/:moduleId/:levelId",SecurityController.getAccess);
}