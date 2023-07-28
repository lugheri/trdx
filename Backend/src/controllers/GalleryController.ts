import { Request, Response } from 'express';
import { unlink } from 'fs/promises'
import sharp from 'sharp';
import { PaginationGalleryDTO } from './Dtos/gallery.dto';

class GalleryController{
  async filterFiles(req:Request,res:Response){
    const pagination = PaginationGalleryDTO.safeParse(req.body)
    if(!pagination.success){
      res.json({"error": pagination.error})  
      return
    }
    try{
      const listFiles = await 
    }catch(e){
      console.log(e)
    }
  }

  async uploadFile(req:Request,res:Response){
    if(req.file){
      const filename = `${req.file.filename}.jpg`
      await sharp(req.file.path)
            .resize(512)
            .toFormat('jpeg')
            .toFile(`./public/gallery/${filename}`);
      await unlink(req.file.path)
            res.json({image:`${filename}`})
    }
    res.json({})
  }

  async infoFile(req:Request,res:Response){}
  async editFile(req:Request,res:Response){}
  async removeFile(req:Request,res:Response){}
  

}
export default new GalleryController();