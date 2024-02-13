"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../controllers/system");
exports.default = (routes) => {
    //Levels
    routes.post("/newLevel", system_1.SystemController.newLevel);
    routes.get("/getLevel/:levelId", system_1.SystemController.getLevel);
    routes.patch("/EditLevel/:levelId", system_1.SystemController.editLevel);
    routes.delete("/RemoveLevel/:levelId", system_1.SystemController.removeLevel);
    routes.get("/listLevels/:status", system_1.SystemController.listLevels);
    //Credentials
    routes.post("/newCredential", system_1.SystemController.newCredential);
    routes.get("/getCredential/:credentialId", system_1.SystemController.getCredential);
    routes.patch("/EditCredential/:credentialId", system_1.SystemController.editCredential);
    routes.delete("/RemoveCredential/:credentialId", system_1.SystemController.removeCredential);
    routes.get("/listCredentials/:status", system_1.SystemController.listCredentials);
    //Modules
    routes.post("/newModule", system_1.SystemController.newModule);
    routes.get("/getModule/:moduleId", system_1.SystemController.getModule);
    routes.patch("/EditModule/:moduleId", system_1.SystemController.editModule);
    routes.delete("/RemoveModule/:moduleId", system_1.SystemController.removeModule);
    routes.get("/listModules/:status", system_1.SystemController.listModules);
    //Cache
    routes.get("/clearCache", system_1.SystemController.clearCache);
};
