import { redisDel, redisGet, redisSet } from "../config/redis";
import { SocialMediaType } from "../controllers/Dtos/homeConfig.dto";
import { SocialMediaChannels, SocialMediaChannelsInstance } from "../models/SocialMediaChannels";


class socialMediaService{
  async newSocialMedia(socialMediaData:SocialMediaType):Promise<boolean | SocialMediaChannelsInstance>{
    await redisDel(`socialMediaChannels`) 
    const [newChannel,created] = await SocialMediaChannels.findOrCreate({
      where:{social_media:socialMediaData.social_media,status:1},
      defaults:socialMediaData
    });
    return newChannel.id ? newChannel : false;
  }
  async getSocialMedias():Promise<SocialMediaChannelsInstance[]>{
    const redisKey = `socialMediaChannels`
    const socialMediasRedis = await redisGet(redisKey)
    if(socialMediasRedis!==null){return socialMediasRedis}

    const socialMedias = await SocialMediaChannels.findAll({
      where:{status:1},
      order:[['order','asc']]
    })
    await redisSet(redisKey,socialMedias)
    return socialMedias
  }
  async infoSocialMedia(media_id:number):Promise<SocialMediaChannelsInstance|null>{
    const redisKey = `infoSocialMedia:[${media_id}]`
    const infoSocialMediaRedis = await redisGet(redisKey)
    if(infoSocialMediaRedis!==null){return infoSocialMediaRedis}

    const infoSocialMedia = await SocialMediaChannels.findByPk(media_id)
    await redisSet(redisKey,infoSocialMedia)
    return infoSocialMedia
  }
  async updateSocialMedia(media_id:number,socialMediaData:SocialMediaType){
    await redisDel(`infoSocialMedia:[${media_id}]`) 
    await redisDel(`socialMediaChannels`)
    const update = await SocialMediaChannels.update(socialMediaData,{where:{id:media_id}})
    await redisDel(`infoButton:[${media_id}]`) 
    await redisDel(`socialMediaChannels`) 
    return update
  }
  async deleteSocialMedia(media_id:number){
    await redisDel(`infoSocialMedia:[${media_id}]`) 
    await redisDel(`socialMediaChannels`) 
    await SocialMediaChannels.destroy({where:{id:media_id}})
    return true
  }

}
export default new socialMediaService()