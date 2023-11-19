import { redisDel, redisGet, redisSet } from "../config/redis";
import { TextHomeType, WelcomeVideoType } from "../controllers/Dtos/homeConfig.dto";
import { HomeConfigCommunity, HomeConfigCommunityInstance } from "../models/HomeConfigCommunity";

class homeConfigCommunityService{
  //Video
  async getWelcomeVideo():Promise<boolean|HomeConfigCommunityInstance>{
    const redisKey = `WelcomeVideoCommunity`
    const WelcomeVideoRedis = await redisGet(redisKey)
    if(WelcomeVideoRedis!==null){ return WelcomeVideoRedis}

    const video = await HomeConfigCommunity.findOne({
      attributes:['idvideo_welcome','video_platform','image_gallery'],
      where:{status:1}
    })
    await redisSet(redisKey,video)
    return video ? video : false
  }

  async updateWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean>{
    await redisDel(`WelcomeVideoCommunity`)
    await HomeConfigCommunity.update(videoData,{where: { status:1}})
    return true;  
  } 

  async createNewWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean | HomeConfigCommunityInstance >{
    await redisDel(`WelcomeVideoCommunity`)
    const [newVideo,created] = await HomeConfigCommunity.findOrCreate({
      where: { status:1},
      defaults:videoData
    });
    console.info('created',created);
    return newVideo.id ? newVideo : false;
  }

  //Text
  async getTextHome():Promise<HomeConfigCommunityInstance | null>{
    const redisKey='TextHomeCommunity'
    const TextHomeRedis = await redisGet(redisKey)
    if(TextHomeRedis!==null){ return TextHomeRedis}
    const TextHome = await HomeConfigCommunity.findOne({
      attributes:['title_text','text','additional_text'],
      where:{status:1}
    })
    await redisSet(redisKey,TextHome)
    return TextHome
  }

  async updateTextHome(textData:TextHomeType):Promise<boolean>{
    await redisDel(`TextHomeCommunity`)
    await HomeConfigCommunity.update(textData,{where: { status:1}})
    return true;  
  } 

  async createNewWelcomeText(textData:TextHomeType):Promise<boolean | HomeConfigCommunityInstance >{
    await redisDel(`TextHomeCommunity`)
    const [newText,created] = await HomeConfigCommunity.findOrCreate({
      where: { status:1},
      defaults:textData
    });
    console.info('created',created);
    return newText.id ? newText : false;
  }

}
export default new homeConfigCommunityService()