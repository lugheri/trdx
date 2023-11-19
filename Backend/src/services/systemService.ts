import { LevelAccessType, LevelAccessPartialType,CredentialAccessType, CredentialAccessPartialType, ModuleAccessType, ModuleAccessPartialType  } from "../controllers/Dtos/usersAccess.dto";
import { Levels, LevelsInstance } from "../models/Levels";
import { Credentials, CredentialsInstance } from "../models/Credentials";
import { Modules, ModulesInstance } from "../models/Modules";

class systemService{
  //LEVELS
  async createNewLevel(levelData:LevelAccessType):Promise<boolean | LevelsInstance >{
    const [newLevel,created] = await Levels.findOrCreate({
      where: { name: levelData.name},
      defaults:levelData
    });
    console.info('created',created);
    return newLevel.id ? newLevel : false;
  }
  async editLevel(levelId:number,levelData:LevelAccessPartialType):Promise<boolean>{   
    await Levels.update(levelData,{where:{id:levelId}})   
    return true;
  }
  async removeLevel(levelId:number):Promise<boolean>{
    await Levels.destroy({where:{id:levelId}})
    return true;
  }
  async getLevel(levelId:number):Promise<boolean | LevelsInstance >{
    const level = await Levels.findByPk(levelId)
    return level ? level : false
  }
  async listLevels(status:1|0):Promise<LevelsInstance[]>{
    const listLevels = await Levels.findAll({where:{status:status}})
    return listLevels
  }

  //CREDENTIALS
  async createNewCredential(credentialData:CredentialAccessType):Promise<boolean | CredentialsInstance >{
    const [newCredential,created] = await Credentials.findOrCreate({
      where: { name: credentialData.name},
      defaults:credentialData
    });
    console.info('created',created);
    return newCredential.id ? newCredential : false;
  }
  async editCredential(credentialId:number,credentialData:CredentialAccessPartialType):Promise<boolean>{   
    await Credentials.update(credentialData,{where:{id:credentialId}})   
    return true;
  }
  async removeCredential(credentialId:number):Promise<boolean>{
    await Credentials.destroy({where:{id:credentialId}})
    return true;
  }
  async getCredential(credentialId:number):Promise<boolean | CredentialsInstance >{
    const credential = await Credentials.findByPk(credentialId)
    return credential ? credential : false
  }
  async listCredentials(status:1|0):Promise<CredentialsInstance[]>{
    const listCredentials = await Credentials.findAll({where:{status:status}})
    return listCredentials
  }

  //MODULES
  async createNewModule(moduleData:ModuleAccessType):Promise<boolean | ModulesInstance >{
    const [newModule,created] = await Modules.findOrCreate({
      where: { name: moduleData.name},
      defaults:moduleData
    });
    console.info('created',created);
    return newModule.id ? newModule : false;
  }
  async editModule(moduleId:number,moduleData:ModuleAccessPartialType):Promise<boolean>{   
    await Modules.update(moduleData,{where:{id:moduleId}})   
    
    return true;
  }
  async removeModule(moduleId:number):Promise<boolean>{
    await Modules.destroy({where:{id:moduleId}})
    return true;
  }
  async getModule(moduleId:number):Promise<boolean | ModulesInstance >{
    const module = await Modules.findByPk(moduleId)  
    return module ? module : false
  }
  async listModules(status:1|0):Promise<ModulesInstance[]>{
    const listModules = await Modules.findAll({where:{status:status}})
    return listModules
  }  
}

export default new systemService()