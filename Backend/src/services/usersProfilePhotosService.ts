import { redisGet, redisSet } from "../config/redis";
import { PhotoProfileType } from "../controllers/Dtos/student.dto";
import { UsersProfilePhotos } from "../models/UsersProfilePhotos";

class UserProfilePhotosService{
  async newPhoto(fileData:PhotoProfileType){      
    const [newFile, created ] = await UsersProfilePhotos.findOrCreate({
      where: {name: fileData.file },
      defaults:fileData
    });
    return newFile.id ? newFile : false
  }
  
  async infoPhoto(fileId:number){
    if(!fileId){return false}
    const redisKey = `infoPhoto:[${fileId}]`
    const infoPhotoRedis = await redisGet(redisKey)
    if(infoPhotoRedis!==null){ return infoPhotoRedis }
    const file = await UsersProfilePhotos.findByPk(fileId)
    const infoPhoto = file ? file : false
    await redisSet(redisKey,infoPhoto)
    return infoPhoto
  }



}
export default new UserProfilePhotosService();