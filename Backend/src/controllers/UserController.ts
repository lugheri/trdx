import { Request,Response } from "express";
import userService from "../services/userService"
import { PaginationUserDTO, UserDataDTO,UserDataPartialDTO } from "./Dtos/usersAccess.dto"

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
      console.log(err)
      res.json({"error":err})  
    }
  }

  async getUser(req:Request, res:Response){ 
    const userId : number = parseInt(req.params.userId)
    try{
      const user = await userService.getUser(userId)
      console.log(user)
      res.json({"success": true,"response": user})  
      return
    }catch(err){
      console.log(err)
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
      console.log(err)
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
      console.log(err)
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
      console.log(err)
      res.json({"error":err})  
    }
  }
}
export default new UserController();