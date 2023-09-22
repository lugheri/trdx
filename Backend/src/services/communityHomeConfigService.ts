import { WelcomeVideoType } from "../controllers/Dtos/communityConfig.dto";
import { CommunityHomeConfig, CommunityHomeConfigInstance } from "../models/CommunityHomeConfig";

class communityHomeConfigService{
  async getWelcomeVideo():Promise<boolean|CommunityHomeConfigInstance>{
    const welcomeVideo = await CommunityHomeConfig.findOne({
      attributes:['idvideo_welcome','video_platform'],
      where:{status:1}
    })
    return welcomeVideo ? welcomeVideo : false
  }

 
  async createNewWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean | WelcomeVideoType >{
    const [newVideo,created] = await CommunityHomeConfig.findOrCreate({
      where: { status:1},
      defaults:videoData
    });
    console.log('created',created);
    return newVideo.id ? newVideo : false;
  }
}
export default new communityHomeConfigService()