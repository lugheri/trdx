import { Router } from "express";
import { SystemController } from "../../controllers/system";

export default (routes: Router) => {
  //Levels
  routes.post("/newLevel", SystemController.newLevel)
  routes.get("/getLevel/:levelId", SystemController.getLevel)
  routes.patch("/EditLevel/:levelId", SystemController.editLevel)
  routes.delete("/RemoveLevel/:levelId", SystemController.removeLevel)
  routes.get("/listLevels/:status", SystemController.listLevels)
  //Credentials
  routes.post("/newCredential", SystemController.newCredential)
  routes.get("/getCredential/:credentialId", SystemController.getCredential)
  routes.patch("/EditCredential/:credentialId", SystemController.editCredential)
  routes.delete("/RemoveCredential/:credentialId", SystemController.removeCredential)
  routes.get("/listCredentials/:status", SystemController.listCredentials)
  //Modules
  routes.post("/newModule", SystemController.newModule)
  routes.get("/getModule/:moduleId", SystemController.getModule)
  routes.patch("/EditModule/:moduleId", SystemController.editModule)
  routes.delete("/RemoveModule/:moduleId", SystemController.removeModule)
  routes.get("/listModules/:status", SystemController.listModules)
  //Cache
  routes.get("/clearCache", SystemController.clearCache)
}