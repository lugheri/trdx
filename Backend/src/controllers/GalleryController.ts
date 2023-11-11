import { Request, Response } from 'express';
import { unlink } from 'fs/promises'
import sharp from 'sharp';
import { FileGalleryDTO, FileGalleryPartialDTO, FolderDTO, 
         FolderPartialDTO, 
         GalleryType, 
         PaginationGalleryDTO } from './Dtos/gallery.dto';
import galleryService from '../services/galleryService';

class GalleryController{
  //Folders
  async newFolder (req:Request,res:Response){
    const dataNewFolder = FolderDTO.safeParse(req.body)
    if(!dataNewFolder.success){
      res.json({"error": dataNewFolder.error})  
      return      
    }
    try{
      const newFolder = await galleryService.newFolder(dataNewFolder.data)
      res.json({"success":true,"response":newFolder})
    }catch(e){
      console.log(e)
    }
  }
  async editFolder (req:Request,res:Response){
    const folderId: number = parseInt(req.params.folderId)
    const dataFolder = FolderPartialDTO.safeParse(req.body)
    if(!dataFolder.success){
      res.json({"error": dataFolder.error})  
      return      
    }
    try{
      const editFolder = await galleryService.editFolder(folderId,dataFolder.data)
      res.json({"success":true,"response":editFolder})
    }catch(e){
      console.log(e)
    }
  }
  async infoFolder (req:Request,res:Response){
    const folderId: number = parseInt(req.params.folderId)
    try{
      const infoFolder = await galleryService.infoFolder(folderId)
      res.json({"success":true,"response":infoFolder})
    }catch(e){
      console.log(e)
    }
  }
  async listFolders (req:Request,res:Response){
    const status:number = parseInt(req.params.status)
    try{
      const listFolders = await galleryService.listFolders(status)
      res.json({"success":true,"response":listFolders})
    }catch(e){
      console.log(e)
    }
  }
  async removeFolder (req:Request,res:Response){
    const folderId: number = parseInt(req.params.folderId)
    try{
      const editFolder = await galleryService.editFolder(folderId,{status:0})
      res.json({"success":true,"response":editFolder})
    }catch(e){
      console.log(e)
    }
  }

  //Gallery
  async filterFiles(req:Request,res:Response){
    const pagination = PaginationGalleryDTO.safeParse(req.body)
    if(!pagination.success){
      res.json({"error": pagination.error})  
      return
    }
    try{
      const listFiles = await galleryService.filterFiles(pagination.data)
      res.json({"success":true,"response":listFiles})
    }catch(e){
      console.log(e)
    }
  }
  async uploadFile(req:Request,res:Response){
    if(req.file){
      const filename = `${req.file.filename}.jpg`
      await sharp(req.file.path)
            /*.resize(512)*/
            .toFormat('jpeg')
            .toFile(`./public/gallery/${filename}`);
      await unlink(req.file.path)

      const dataNewFile = FileGalleryDTO.safeParse(req.body)
      if(!dataNewFile.success){
        res.json({"error": dataNewFile.error})  
        return      
      }
      try{
        const dataFile:GalleryType={
          "name":dataNewFile.data.name,
          "description":dataNewFile.data.description,
          "file":filename,
          "extension":req.file.mimetype, 
          "size":req.file.size,
          "folder":dataNewFile.data.folder,
          "status":1
        }
        const extension = req.file.mimetype
        const size = req.file.size
        const newFile = await galleryService.newFile(dataFile)
        res.json({"success":true,"response":newFile})
        return
      }catch(e){
        console.log(e)
      }
    }    
    res.json({"error":true})  
  }
  async infoFile(req:Request,res:Response){
    const fileId: number = parseInt(req.params.fileId)
    try{
      const infoFile = await galleryService.infoFile(fileId)
      res.json({"success":true,"response":infoFile})
    }catch(e){
      console.log(e)
    }
  }
  async editFile(req:Request,res:Response){
    const fileId: number = parseInt(req.params.fileId)
    const dataFile = FileGalleryPartialDTO.safeParse(req.body)
    if(!dataFile.success){
      res.json({"error": dataFile.error})  
      return      
    }
    try{
      const editFile = await galleryService.editFile(fileId,dataFile.data)
      res.json({"success":true,"response":editFile})
    }catch(e){
      console.log(e)
    }
  }
  async removeFile(req:Request,res:Response){
    const fileId: number = parseInt(req.params.fileId)
    try{
      const editFile = await galleryService.editFile(fileId,{status:0})
      res.json({"success":true,"response":editFile})
    }catch(e){
      console.log(e)
    }
  }
}
export default new GalleryController();