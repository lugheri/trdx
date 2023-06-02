import { GetModulesType } from "../controllers/Dtos/securityPolicies.dto";
import { Modules, ModulesInstance } from "../models/Modules";
import { SecurityPolicies, SecurityPoliciesInstance } from "../models/SecurityPolicies";

class SecurityService{
  /*async getModules(levelId:number,moduleId:number):Promise<SecurityPoliciesInstance[]>{
    const modules = await SecurityPolicies.findAll({where: { level_id: levelId, parent_module_id:moduleId,  active:1 }})                                                      
    return modules
  }*/

  async modulesPolicies(params:GetModulesType):Promise<ModulesInstance[]>{
    const modules = await Modules.findAll({
      where: {type: params.type, parent: params.moduleParentId ,status:1},order:[['order','ASC']],
      include: { model: SecurityPolicies, attributes: [], where: { level_id: params.levelId, active:1},},
    })
    return modules
  }
 

  async checkAccess(moduleId:number,levelId:number):Promise<boolean>{
    const checkAccessPolice = await SecurityPolicies.findOne({attributes:['active'],
                                                                   where:{level_id:levelId,module_id:moduleId}})
    return checkAccessPolice ? checkAccessPolice.active === 1 ? true : false : false
  }
}
export default new SecurityService();