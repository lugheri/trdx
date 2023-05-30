import { SecurityPolicies, SecurityPoliciesInstance } from "../models/SecurityPolicies";


class SecurityService{
  async getModules(levelId:number,moduleId:number):Promise<SecurityPoliciesInstance[]>{
    const modules = await SecurityPolicies.findAll({where: { level_id: levelId, parent_module_id:moduleId,  active:1 }})                                                      
    return modules
  }
 

  async checkAccess(moduleId:number,levelId:number):Promise<boolean>{
    const checkAccessPolice = await SecurityPolicies.findOne({attributes:['active'],
                                                                   where:{level_id:levelId,module_id:moduleId}})
    return checkAccessPolice ? checkAccessPolice.active === 1 ? true : false : false
  }
}
export default new SecurityService();