import { redisGet, redisSet } from "../config/redis";
import { PhotoProfilePartialType, PhotoProfileType } from "../controllers/Dtos/student.dto";
import { StudentsProfilePhotos } from "../models/StudentsProfilePhotos";

class StudentsProfilePhotosServices{
  async newPhoto(fileData:PhotoProfileType){      
    const [newFile, created ] = await StudentsProfilePhotos.findOrCreate({
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
    const file = await StudentsProfilePhotos.findByPk(fileId)
    const infoPhoto = file ? file : false
    await redisSet(redisKey,infoPhoto)
    return infoPhoto
  }



}
export default new StudentsProfilePhotosServices();