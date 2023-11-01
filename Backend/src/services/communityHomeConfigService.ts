import { redisDel, redisGet, redisSet } from "../config/redis";
import { TextHomeCommunityType, WelcomeVideoType } from "../controllers/Dtos/communityConfig.dto";
import { CommunityHomeConfig, CommunityHomeConfigInstance } from "../models/CommunityHomeConfig";

class communityHomeConfigService{
  //Video
  async getWelcomeVideo():Promise<boolean|CommunityHomeConfigInstance>{
    const redisKey = `WelcomeVideo`
    const WelcomeVideoRedis = await redisGet(redisKey)
    if(WelcomeVideoRedis!==null){ return WelcomeVideoRedis}

    const welcomeVideo = await CommunityHomeConfig.findOne({
      attributes:['idvideo_welcome','video_platform'],
      where:{status:1}
    })
    await redisSet(redisKey,welcomeVideo)
    return welcomeVideo ? welcomeVideo : false
  }

  async updateWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean | WelcomeVideoType >{
    await redisDel(`WelcomeVideo`)
    await CommunityHomeConfig.update(videoData,{where: { status:1}})
    return true;  
  } 
  async createNewWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean | WelcomeVideoType >{
    await redisDel(`WelcomeVideo`)
    const [newVideo,created] = await CommunityHomeConfig.findOrCreate({
      where: { status:1},
      defaults:videoData
    });
    console.log('created',created);
    return newVideo.id ? newVideo : false;
  }

  async getTextHome():Promise<CommunityHomeConfigInstance | null>{
    const redisKey='TextHome'
    const TextHomeRedis = await redisGet(redisKey)
    if(TextHomeRedis!==null){ return TextHomeRedis}
    const TextHome = await CommunityHomeConfig.findOne({
      attributes:['title_text','text'],
      where:{status:1}
    })
    await redisSet(redisKey,TextHome)
    return TextHome
  }

  async updateTextHome(textData:TextHomeCommunityType):Promise<boolean | CommunityHomeConfigInstance>{
    await redisDel(`TextHome`)
    await CommunityHomeConfig.update(textData,{where: { status:1}})
    return true;  
  }


}
export default new communityHomeConfigService()