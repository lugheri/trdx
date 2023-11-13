import { redisDel, redisGet, redisSet } from "../config/redis";
import { FileGalleryPartialType, FileGalleryType, FolderPartialType, FolderType, GalleryType, PaginationGalleryTypes } from "../controllers/Dtos/gallery.dto";
import { Gallery, GalleryInstance } from "../models/Gallery";
import { GalleryFolder } from "../models/GalleryFolders";

class GalleryServices{
  //Folders
  async newFolder(dataFolder:FolderType){
    await redisDel(`listFoldersGallery`)
    const [newFolder, created ] = await GalleryFolder.findOrCreate({
      where: {name: dataFolder.name },
      defaults:dataFolder
    });
    return newFolder.id ? newFolder : false
  }
  async editFolder(folderId:number,dataFolder:FolderPartialType){
    await redisDel(`listFoldersGallery`)
    await redisDel(`infoFolder[${folderId}]`)
    await GalleryFolder.update(dataFolder,{where:{id:folderId}})   
    return true;    
  }
  async infoFolder(folderId:number){
    const redisKey = `infoFolder[${folderId}]`
    const infoFolderRedis = await redisGet(redisKey)
    if(infoFolderRedis!==null){ return infoFolderRedis }   
    const folder = await GalleryFolder.findByPk(folderId)
    await redisSet(redisKey,folder ? folder : false)
    return folder ? folder : false
  }
  async listFolders(status:number){
    const redisKey = `listFoldersGallery`
    const listFoldersGalleryRedis = await redisGet(redisKey)
    if(listFoldersGalleryRedis!==null){ return listFoldersGalleryRedis }   

    const listFolders = await GalleryFolder.findAll({
      where:{status:status},
      order:[['id','DESC']]
    })
    await redisSet(redisKey,listFolders)
    return listFolders
  }

  //Gallery
  async newFile(fileData:GalleryType){      
    const [newFile, created ] = await Gallery.findOrCreate({
      where: {name: fileData.name },
      defaults:fileData
    });
    return newFile.id ? newFile : false
  }
  async filterFiles(pagination:PaginationGalleryTypes){
    const p = pagination.page-1
    const qtdRegPage = 15
    const offset = qtdRegPage * p 

    const filterFiles = await Gallery.findAll({
      where:{status:pagination.status},
      order:[[pagination.orderedBy,pagination.order]],
      offset:offset,
      limit:qtdRegPage
    })
    return filterFiles
  }
  async infoFile(fileId:number){
    const file = await Gallery.findByPk(fileId)
    return file ? file : false
  }
  async editFile(fileId:number,fileData:FileGalleryPartialType){
    await Gallery.update(fileData,{where:{id:fileId}})   
    return true;  
  }
}
export default new GalleryServices();