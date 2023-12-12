import { Request, Response } from "express";
import { LevelAccessDTO, LevelAccessPartialDTO } from "../Dtos/usersAccess.dto";
import systemService from "../../services/systemService";


export const newLevel = async (req:Request, res:Response) => { 
  const dataLevel = LevelAccessDTO.safeParse(req.body)
  if(!dataLevel.success){
    res.json({"error":dataLevel.error})
    return
  }
  try{
    //Create a new level
    const dataNewlevel = await systemService.createNewLevel(dataLevel.data)
    if(dataNewlevel){
      res.json({"success": true,"response": dataNewlevel})  
      return
    }
    res.json({"error":"Falha ao criar o novo Nível de acesso!"})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const getLevel = async (req:Request, res:Response) => { 
  const levelId : number = parseInt(req.params.levelId)
  try{
    const level = await systemService.getLevel(levelId)
    console.error(level)
    res.json({"success": true,"response": level})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const editLevel = async (req:Request, res:Response) => {
  const levelId : number = parseInt(req.params.levelId)
  const dataLevel = LevelAccessPartialDTO.safeParse(req.body)
  if(!dataLevel.success){
    res.json({"error": dataLevel.error})  
    return
  }
  try{
    const edit = await systemService.editLevel(levelId, dataLevel.data)
    res.json({"success": true,"response": edit})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const removeLevel = async (req:Request, res:Response) => { 
  const levelId : number = parseInt(req.params.levelId)
  try{
    await systemService.removeLevel(levelId)
    res.json({"success": true})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const listLevels = async (req:Request, res:Response) => {
  const statusLevels = parseInt(req.params.status) as 1|0
  try{
    const listLevels = await systemService.listLevels(statusLevels)
    res.json({"success": true,"response": listLevels})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}