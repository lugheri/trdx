import { IntegrationPlatformType } from "../controllers/Dtos/integration.dto";
import { IntegrationPlatforms, IntegrationPlatformsInstance } from "../models/IntegrationPlatforms";

class IntegrationPlatformService{

  async newIntegration(dataIntegration:IntegrationPlatformType):Promise<boolean | IntegrationPlatformsInstance>{
    const [newIntegration,created] = await IntegrationPlatforms.findOrCreate({
      where:{name:dataIntegration.name},
      defaults:dataIntegration
    })
    console.info(created)
    return newIntegration.id ? newIntegration : false
  }

  async getIntegrations(status:number){
    const listPlatformIntegrations = await IntegrationPlatforms.findAll({
      where: {status: status},
    })
    return listPlatformIntegrations
  }

  async infoIntegrations(integration_id:number){
    const infoIntegration = await IntegrationPlatforms.findByPk(integration_id)
    return infoIntegration
  }

  async editIntegration(integration_id:number,dataIntegration:IntegrationPlatformType){
    await IntegrationPlatforms.update(dataIntegration,{where:{id:integration_id}})
    return true;
  }

}
export default new IntegrationPlatformService();