import { redisDel, redisGet, redisSet } from "../config/redis";
import { ButtonHomeType } from "../controllers/Dtos/homeConfig.dto";
import { HomeButtons, HomeButtonsInstance } from "../models/HomeButtons";

class homeButtonsServices{
  async newButtonHome(buttonData:ButtonHomeType):Promise<boolean | HomeButtonsInstance>{
    await redisDel(`buttonsHome`) 
    const [newButton,created] = await HomeButtons.findOrCreate({
      where:{name:buttonData.name,status:1},
      defaults:buttonData
    });
    return newButton.id ? newButton : false;
  }
  async getButtonsHome():Promise<HomeButtonsInstance[]>{
    const redisKey = `buttonsHome`
    const buttonsHomeRedis = await redisGet(redisKey)
    if(buttonsHomeRedis!==null){return buttonsHomeRedis}

    const buttonsHome = await HomeButtons.findAll({
      where:{status:1},
      order:[['order','asc']]
    })
    await redisSet(redisKey,buttonsHome)
    return buttonsHome
  }
  async infoButtonHome(button_id:number):Promise<HomeButtonsInstance|null>{
    const redisKey = `infoButton:[${button_id}]`
    const infoButtonRedis = await redisGet(redisKey)
    if(infoButtonRedis!==null){return infoButtonRedis}

    const infoButton = await HomeButtons.findByPk(button_id)
    await redisSet(redisKey,infoButton)
    return infoButton
  }
  async updateButtonHome(button_id:number,buttonData:ButtonHomeType){
    await redisDel(`infoButton:[${button_id}]`) 
    await redisDel(`buttonsHome`)
    const update = await HomeButtons.update(buttonData,{where:{id:button_id}})
    await redisDel(`infoButton:[${button_id}]`) 
    await redisDel(`buttonsHome`) 
    return update
  }
  async deleteButtonHome(button_id:number){
    await redisDel(`infoButton:[${button_id}]`) 
    await redisDel(`buttonsHome`) 
    await HomeButtons.destroy({where:{id:button_id}})
    return true

  }

}

export default new homeButtonsServices()