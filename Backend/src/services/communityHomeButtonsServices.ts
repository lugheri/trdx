import { redisDel, redisGet, redisSet } from "../config/redis";
import { ButtonHomeCommunityType } from "../controllers/Dtos/communityConfig.dto";
import { CommunityHomeButtons, CommunityHomeButtonsInstance } from "../models/CommunityHomeButtons";

class communityHomeButtonsServices{
  async newButtonHome(buttonData:ButtonHomeCommunityType):Promise<boolean | CommunityHomeButtonsInstance>{
    await redisDel(`buttonsHome`) 
    const [newButton,created] = await CommunityHomeButtons.findOrCreate({
      where:{name:buttonData.name,status:1},
      defaults:buttonData
    });
    return newButton.id ? newButton : false;
  }
  async getButtonsHome():Promise<CommunityHomeButtonsInstance[]>{
    const redisKey = `buttonsHome`
    const buttonsHomeRedis = await redisGet(redisKey)
    if(buttonsHomeRedis!==null){return buttonsHomeRedis}

    const buttonsHome = await CommunityHomeButtons.findAll({
      where:{status:1},
      order:[['order','asc']]
    })
    await redisSet(redisKey,buttonsHome)
    return buttonsHome
  }
  async infoButtonHome(button_id:number):Promise<ButtonHomeCommunityType|null>{
    const redisKey = `infoButton:[${button_id}]`
    const infoButtonRedis = await redisGet(redisKey)
    if(infoButtonRedis!==null){return infoButtonRedis}

    const infoButton = await CommunityHomeButtons.findByPk(button_id)
    await redisSet(redisKey,infoButton)
    return infoButton
  }
  async updateButtonHome(button_id:number,buttonData:ButtonHomeCommunityType){
    await redisDel(`infoButton:[${button_id}]`) 
    await redisDel(`buttonsHome`)
    const update = await CommunityHomeButtons.update(buttonData,{where:{id:button_id}})
    await redisDel(`infoButton:[${button_id}]`) 
    await redisDel(`buttonsHome`) 
    return update
  }
  async deleteButtonHome(button_id:number){
    await redisDel(`infoButton:[${button_id}]`) 
    await redisDel(`buttonsHome`) 
    await CommunityHomeButtons.destroy({where:{id:button_id}})
    return true

  }

}

export default new communityHomeButtonsServices()