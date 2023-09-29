import { WelcomeVideoType } from "../controllers/Dtos/communityConfig.dto";
import { ContentHomeConfig, ContentHomeConfigInstance } from "../models/ContentHomeConfig";

class contentHomeConfigService{
  async getWelcomeVideo():Promise<boolean|ContentHomeConfigInstance>{
    const welcomeVideo = await ContentHomeConfig.findOne({
      attributes:['idvideo_welcome','video_platform'],
      where:{status:1}
    })
    return welcomeVideo ? welcomeVideo : false
  }

 
  async createNewWelcomeVideo(videoData:WelcomeVideoType):Promise<boolean | WelcomeVideoType >{
    const [newVideo,created] = await ContentHomeConfig.findOrCreate({
      where: { status:1},
      defaults:videoData
    });
    console.log('created',created);
    return newVideo.id ? newVideo : false;
  }
}
export default new contentHomeConfigService()