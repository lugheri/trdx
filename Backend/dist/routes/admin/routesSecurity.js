"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SecurityController_1 = __importDefault(require("../../controllers/SecurityController"));
exports.default = (routes) => {
    /*routes.get("/getModulesLevel/:levelId",SecurityController.getModuleLevel);*/
    routes.get("/modules/:type/:moduleParentId/:levelId", SecurityController_1.default.getModules);
    routes.get("/subModules/:type/:module/:levelId", SecurityController_1.default.subModules);
    routes.get("/checkAccess/:moduleId/:levelId", SecurityController_1.default.getAccess);
};
