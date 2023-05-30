import { Request, Response } from "express";
import { CheckAccessDTO } from "./Dtos/securityPolicies.dto";
import securityService from "../services/securityService";
import { ModulesInstance } from "../models/Modules";
import systemService from "../services/systemService";
class Security{
  async getModuleLevel(req:Request,res:Response){
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
  }
 
  async getAccess(req:Request,res:Response){
    const params = CheckAccessDTO.required()
    const dataParams = params.safeParse(req.params) 
    
    if(!dataParams.success){
      res.json({"error":dataParams.error})
      return
    }

    const { moduleId, levelId} = dataParams.data

    const access = await securityService.checkAccess(moduleId,levelId);

    res.json({"success": true,"response": access})  

  }
}
export default new Security();