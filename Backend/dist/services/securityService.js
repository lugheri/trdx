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
Object.defineProperty(exports, "__esModule", { value: true });
const Modules_1 = require("../models/Modules");
const SecurityPolicies_1 = require("../models/SecurityPolicies");
class SecurityService {
    /*async getModules(levelId:number,moduleId:number):Promise<SecurityPoliciesInstance[]>{
      const modules = await SecurityPolicies.findAll({where: { level_id: levelId, parent_module_id:moduleId,  active:1 }})
      return modules
    }*/
    modulesPolicies(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = yield Modules_1.Modules.findAll({
                where: { type: params.type, parent: params.moduleParentId, status: 1 }, order: [['order', 'ASC']],
                include: { model: SecurityPolicies_1.SecurityPolicies, attributes: [], where: { level_id: params.levelId, active: 1 }, },
            });
            return modules;
        });
    }
    subModulesPolicies(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleData = yield Modules_1.Modules.findOne({ attributes: ['id'], where: { name: params.module } });
            const modules = yield Modules_1.Modules.findAll({
                where: { type: params.type, parent: moduleData === null || moduleData === void 0 ? void 0 : moduleData.id, status: 1 }, order: [['order', 'ASC']],
                include: { model: SecurityPolicies_1.SecurityPolicies, attributes: [], where: { level_id: params.levelId, active: 1 }, },
            });
            return modules;
        });
    }
    checkAccess(moduleId, levelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkAccessPolice = yield SecurityPolicies_1.SecurityPolicies.findOne({ attributes: ['active'],
                where: { level_id: levelId, module_id: moduleId } });
            return checkAccessPolice ? checkAccessPolice.active === 1 ? true : false : false;
        });
    }
}
exports.default = new SecurityService();
