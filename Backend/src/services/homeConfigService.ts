import { redisDel, redisGet, redisSet } from "../config/redis";
import { TextHomeType, WelcomeVideoType } from "../controllers/Dtos/homeConfig.dto";
import { HomeConfig, HomeConfigInstance } from "../models/HomeConfig";

class homeConfigService{
  //Video
  async getWelcomeVideo():Promise<boolean|HomeConfigInstance>{
    const redisKey = `WelcomeVideo`
    const WelcomeVideoRedis = await redisGet(redisKey)
    if(WelcomeVideoRedis!==null){ return WelcomeVideoRedis}

    const video = await HomeConfig.findOne({
      attributes:['idvideo_welcome','video_platform','image_gallery'],
      where:{status:1}
    })
    await redisSet(redisKey,video)
    return video ? video : false
  }

  async updateWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean>{
    await redisDel(`WelcomeVideo`)
    await HomeConfig.update(videoData,{where: { status:1}})
    return true;  
  } 

  async createNewWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean | HomeConfigInstance >{
    await redisDel(`WelcomeVideo`)
    const [newVideo,created] = await HomeConfig.findOrCreate({
      where: { status:1},
      defaults:videoData
    });
    console.info('created',created);
    return newVideo.id ? newVideo : false;
  }

  //Text
  async getTextHome():Promise<HomeConfigInstance | null>{
    const redisKey='TextHome'
    const TextHomeRedis = await redisGet(redisKey)
    if(TextHomeRedis!==null){ return TextHomeRedis}
    const TextHome = await HomeConfig.findOne({
      attributes:['title_text','text','additional_text'],
      where:{status:1}
    })
    await redisSet(redisKey,TextHome)
    return TextHome
  }

  async updateTextHome(textData:TextHomeType):Promise<boolean>{
    await redisDel(`TextHome`)
    await HomeConfig.update(textData,{where: { status:1}})
    return true;  
  } 

  async createNewWelcomeText(textData:TextHomeType):Promise<boolean | HomeConfigInstance >{
    await redisDel(`TextHome`)
    const [newText,created] = await HomeConfig.findOrCreate({
      where: { status:1},
      defaults:textData
    });
    console.info('created',created);
    return newText.id ? newText : false;
  }

}
export default new homeConfigService()