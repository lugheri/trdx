"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const securityPolicies_dto_1 = require("./Dtos/securityPolicies.dto");
const securityService_1 = __importDefault(require("../services/securityService"));
class Security {
    /*async getModuleLevel(req:Request,res:Response){
      const levelId: number = parseInt(req.params.levelId)
      const modules = await securityService.getModules(levelId,0)
      const allModules:any = []
      for(let i = 0; i < modules.length; i++){
          const module:any = {...modules[i].dataValues}
                const infoModule = await systemService.getModule(modules[i].module_id)
                if(typeof infoModule !== 'boolean'){
                  module['info']=infoModule
                }
          //Submodules
          const allSubModules:any = []
          const subModules = await securityService.getModules(levelId,modules[i].module_id)
          for(let i = 0; i < subModules.length; i++){
           const subModule:any = {...subModules[i].dataValues}
                 const infoSubModule = await systemService.getModule(subModules[i].module_id)
                 if(typeof infoSubModule !== 'boolean'){
                  subModule['info']=infoSubModule
                }
           allSubModules.push(subModule)
          }
          module['submodules']=allSubModules
          allModules.push(module)
      }
      res.json({"success": true,"response": allModules})
    }*/
    getModules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = securityPolicies_dto_1.GetModulesDTO;
            const dataParams = params.safeParse(req.params);
            if (!dataParams.success) {
                res.json({ "error": dataParams.error });
                return;
            }
            const modules = yield securityService_1.default.modulesPolicies(dataParams.data);
            res.json({ "success": true, "response": modules });
        });
    }
    subModules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = securityPolicies_dto_1.GetSubModulesDTO;
            const dataParams = params.safeParse(req.params);
            if (!dataParams.success) {
                res.json({ "error": dataParams.error });
                return;
            }
            const modules = yield securityService_1.default.subModulesPolicies(dataParams.data);
            res.json({ "success": true, "response": modules });
        });
    }
    getAccess(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = securityPolicies_dto_1.CheckAccessDTO.required();
            const dataParams = params.safeParse(req.params);
            if (!dataParams.success) {
                res.json({ "error": dataParams.error });
                return;
            }
            const { moduleId, levelId } = dataParams.data;
            const access = yield securityService_1.default.checkAccess(moduleId, levelId);
            res.json({ "success": true, "response": access });
        });
    }
}
exports.default = new Security();
