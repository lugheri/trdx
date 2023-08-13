import { FileGalleryPartialType, FileGalleryType, FolderPartialType, FolderType, GalleryType, PaginationGalleryTypes } from "../controllers/Dtos/gallery.dto";
import { Gallery, GalleryInstance } from "../models/Gallery";
import { GalleryFolder } from "../models/GalleryFolders";

class GalleryServices{
  //Folders
  async newFolder(dataFolder:FolderType){
    const [newFolder, created ] = await GalleryFolder.findOrCreate({
      where: {name: dataFolder.name },
      defaults:dataFolder
    });
    return newFolder.id ? newFolder : false
  }
  async editFolder(folderId:number,dataFolder:FolderPartialType){
    await GalleryFolder.update(dataFolder,{where:{id:folderId}})   
    return true;    
  }
  async infoFolder(folderId:number){
    const folder = await GalleryFolder.findByPk(folderId)
    return folder ? folder : false
  }
  async listFolders(status:number){
    const listFolders = await GalleryFolder.findAll({where:{status:status}})
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