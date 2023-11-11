import { redisDel, redisGet, redisSet } from "../config/redis";
import { ButtonHomeType } from "../controllers/Dtos/homeConfig.dto";
import { HomeButtonsCommunity, HomeButtonsCommunityInstance } from "../models/HomeButtonsCommunity";

class homeButtonsCommunityServices{
  async newButtonHome(buttonData:ButtonHomeType):Promise<boolean | HomeButtonsCommunityInstance>{
    await redisDel(`buttonsHomeCommunity`) 
    const [newButton,created] = await HomeButtonsCommunity.findOrCreate({
      where:{name:buttonData.name,status:1},
      defaults:buttonData
    });
    return newButton.id ? newButton : false;
  }
  async getButtonsHome():Promise<HomeButtonsCommunityInstance[]>{
    const redisKey = `buttonsHomeCommunity`
    const buttonsHomeRedis = await redisGet(redisKey)
    if(buttonsHomeRedis!==null){return buttonsHomeRedis}

    const buttonsHome = await HomeButtonsCommunity.findAll({
      where:{status:1},
      order:[['order','asc']]
    })
    await redisSet(redisKey,buttonsHome)
    return buttonsHome
  }
  async infoButtonHome(button_id:number):Promise<HomeButtonsCommunityInstance|null>{
    const redisKey = `infoButtonCommunity:[${button_id}]`
    const infoButtonRedis = await redisGet(redisKey)
    if(infoButtonRedis!==null){return infoButtonRedis}

    const infoButton = await HomeButtonsCommunity.findByPk(button_id)
    await redisSet(redisKey,infoButton)
    return infoButton
  }
  async updateButtonHome(button_id:number,buttonData:ButtonHomeType){
    await redisDel(`infoButtonCommunity:[${button_id}]`) 
    await redisDel(`buttonsHomeCommunity`)
    const update = await HomeButtonsCommunity.update(buttonData,{where:{id:button_id}})
    await redisDel(`infoButtonCommunity:[${button_id}]`) 
    await redisDel(`buttonsHomeCommunity`) 
    return update
  }
  async deleteButtonHome(button_id:number){
    await redisDel(`infoButtonCommunity:[${button_id}]`) 
    await redisDel(`buttonsHomeCommunity`) 
    await HomeButtonsCommunity.destroy({where:{id:button_id}})
    return true

  }

}

export default new homeButtonsCommunityServices()