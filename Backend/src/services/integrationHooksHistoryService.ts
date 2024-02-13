import { redisGet } from "../config/redis";
import { IntegrationHookType, PaginationHooksType } from "../controllers/Dtos/integration.dto";
import { IntegrationHooksHistory, IntegrationHooksHistoryInstance } from "../models/IntegrationHooksHistory";

class IntegrationHooksHistoryService{
  async createNewCourse(dataHook:IntegrationHookType):Promise<boolean|IntegrationHooksHistoryInstance>{
    const newHook = await IntegrationHooksHistory.create(dataHook);
    return newHook.id ? newHook : false
  }
  
  async listIntegrationHooks(page:number,integration:string,product_id:number):Promise<IntegrationHooksHistoryInstance[]>{   
    const p = page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    const listHooks = await IntegrationHooksHistory.findAll({
      where:{integration:integration,product_id:product_id},
      order:[['id','DESC']],
      offset:offset,
      limit:qtdRegPage
    })
    return listHooks
  } 

  async getHook(hookId:number):Promise<boolean | IntegrationHooksHistoryInstance>{
    const hook = await IntegrationHooksHistory.findByPk(hookId)
    return hook ? hook : false
  }  

}
export default new IntegrationHooksHistoryService();