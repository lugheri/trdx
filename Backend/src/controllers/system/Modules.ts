import { Request, Response } from "express";
import { ModuleAccessDTO, ModuleAccessPartialDTO } from "../Dtos/usersAccess.dto";
import systemService from "../../services/systemService";


export const newModule = async (req:Request, res:Response) => { 
  const dataModule = ModuleAccessDTO.safeParse(req.body)
  if(!dataModule.success){
    res.json({"error":dataModule.error})
    return
  }
  try{
    //Create a new module
    const dataNewModule = await systemService.createNewModule(dataModule.data)
    if(dataNewModule){
      res.json({"success": true,"response": dataNewModule})  
      return
    }
    res.json({"error":"Falha ao criar o novo Nível de acesso!"})  
    return
  }catch(err){
    console.log(err)
    res.json({"error":err})  
  }
}

export const getModule = async (req:Request, res:Response) => { 
  const moduleId : number = parseInt(req.params.moduleId)
  try{
    const module = await systemService.getModule(moduleId)
    console.log(module)
    res.json({"success": true,"response": module})  
    return
  }catch(err){
    console.log(err)
    res.json({"error":err})  
  }
}

export const editModule = async (req:Request, res:Response) => {
  const moduleId : number = parseInt(req.params.moduleId)
  const dataModule = ModuleAccessPartialDTO.safeParse(req.body)
  if(!dataModule.success){
    res.json({"error": dataModule.error})  
    return
  }
  try{
    const edit = await systemService.editModule(moduleId, dataModule.data)
    res.json({"success": true,"response": edit})  
    return
  }catch(err){
    console.log(err)
    res.json({"error":err})  
  }
}

export const removeModule = async (req:Request, res:Response) => { 
  const moduleId : number = parseInt(req.params.moduleId)
  try{
    await systemService.removeModule(moduleId)
    res.json({"success": true})  
    return
  }catch(err){
    console.log(err)
    res.json({"error":err})  
  }
}

export const listModules = async (req:Request, res:Response) => {
  const statusModules = parseInt(req.params.status) as 1|0
  try{
    const listModules = await systemService.listModules(statusModules)
    res.json({"success": true,"response": listModules})  
    return
  }catch(err){
    console.log(err)
    res.json({"error":err})  
  }
}