import { Request,Response } from "express";
import userService from "../services/userService"
import { PaginationUserDTO, PhotoProfileUserDTO, UserDataDTO,UserDataPartialDTO } from "./Dtos/usersAccess.dto"
import usersProfilePhotosService from "../services/usersProfilePhotosService";
import { PhotoProfileType } from "./Dtos/student.dto";
import sharp from 'sharp';
import { unlink } from 'fs/promises'

class UserController{
  async newUser(req:Request, res:Response){ 
    const dataUser = UserDataDTO.safeParse(req.body)
    if(!dataUser.success){
      res.json({"error":dataUser.error})
      return
    }
    try{
      //Create a new credential
      const dataNewUser = await userService.createNewUser(dataUser.data)
      if(dataNewUser){
        res.json({"success": true,"response": dataNewUser})  
        return
      }
      res.json({"error":"Falha ao criar o novo Usuário de acesso!"})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }

  async userPhotoProfile(req:Request,res:Response){
    const fileId: number = parseInt(req.params.photo_id)
    try{
      const infoPhoto = await usersProfilePhotosService.infoPhoto(fileId)
      res.json({"success":true,"response":infoPhoto})
    }catch(err){
      console.error(err)
    }
  }

  async newUserPhotoProfile(req:Request,res:Response){
    if(req.file){
      const filename = `${req.file.filename}.jpg`
      await sharp(req.file.path)
            .resize(200)
            .toFormat('jpeg')
            .toFile(`./public/gallery/${filename}`);
      await unlink(req.file.path)     
      
      const dataNewFile = PhotoProfileUserDTO.safeParse(req.body)
      if(!dataNewFile.success){
        res.json({"error": dataNewFile.error})  
        return      
      }
      try{
        const dataFile:PhotoProfileType={
          "name":`${dataNewFile.data.user_id} - ${dataNewFile.data.name}` ,
          "description":`${dataNewFile.data.name} User profile photo`,
          "file":filename,
          "extension":req.file.mimetype, 
          "size":req.file.size,
          "status":1
        }
        const extension = req.file.mimetype
        const size = req.file.size
        const newFile = await usersProfilePhotosService.newPhoto(dataFile)

        //Update photo student
        if(newFile){
          const userId : number = parseInt(dataNewFile.data.user_id as string)
          const newProfile = {photo:newFile.id}        
          try{
            const edit = await userService.editUser(userId, newProfile)
            res.json({"success": true,"response": edit})  
            return
          }catch(err){
            console.error(err)
            res.json({"error":err})  
          }
        }
        res.json({"success":true,"response":newFile})
        return
      }catch(err){
        console.error(err)
      }
    }    
  }

  async getUser(req:Request, res:Response){ 
    const userId : number = parseInt(req.params.userId)
    try{
      const user = await userService.getUser(userId)
      res.json({"success": true,"response": user})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  
  async editUser(req:Request, res:Response){
    const userId : number = parseInt(req.params.userId)
    const dataUser = UserDataPartialDTO.safeParse(req.body)
    if(!dataUser.success){
      res.json({"error": dataUser.error})  
      return
    }
    try{
      const edit = await userService.editUser(userId, dataUser.data)
      res.json({"success": true,"response": edit})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  
  async removeUser(req:Request, res:Response){ 
    const userId : number = parseInt(req.params.userId)
    try{
      await userService.removeUser(userId)
      res.json({"success": true})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  
  async listUsers(req:Request, res:Response){
    const pagination = PaginationUserDTO.safeParse(req.body)
    if(!pagination.success){
      res.json({"error": pagination.error})  
      return
    }  
    try{
      const listUsers = await userService.listUsers(pagination.data)
      res.json({"success": true,"response": listUsers})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
}
export default new UserController();