import { Router } from "express";
import SecurityController from "../controllers/SecurityController";

export default (routes : Router) => {
  routes.get("/getModulesLevel/:levelId",SecurityController.getModuleLevel);
  routes.get("/checkAccess/:moduleId/:levelId",SecurityController.getAccess);
}