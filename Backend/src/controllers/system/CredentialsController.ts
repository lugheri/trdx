import { Request, Response } from "express";
import { CredentialAccessDTO, CredentialAccessPartialDTO } from "../Dtos/usersAccess.dto";
import systemService from "../../services/systemService";


export const newCredential = async (req:Request, res:Response) => { 
  const dataCredential = CredentialAccessDTO.safeParse(req.body)
  if(!dataCredential.success){
    res.json({"error":dataCredential.error})
    return
  }
  try{
    //Create a new credential
    const dataNewCredential = await systemService.createNewCredential(dataCredential.data)
    if(dataNewCredential){
      res.json({"success": true,"response": dataNewCredential})  
      return
    }
    res.json({"error":"Falha ao criar o novo Nível de acesso!"})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const getCredential = async (req:Request, res:Response) => { 
  const credentialId : number = parseInt(req.params.credentialId)
  try{
    const credential = await systemService.getCredential(credentialId)
    console.info(credential)
    res.json({"success": true,"response": credential})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const editCredential = async (req:Request, res:Response) => {
  const credentialId : number = parseInt(req.params.credentialId)
  const dataCredential = CredentialAccessPartialDTO.safeParse(req.body)
  if(!dataCredential.success){
    res.json({"error": dataCredential.error})  
    return
  }
  try{
    const edit = await systemService.editCredential(credentialId, dataCredential.data)
    res.json({"success": true,"response": edit})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const removeCredential = async (req:Request, res:Response) => { 
  const credentialId : number = parseInt(req.params.credentialId)
  try{
    await systemService.removeCredential(credentialId)
    res.json({"success": true})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}

export const listCredentials = async (req:Request, res:Response) => {
  const statusCredentials = parseInt(req.params.status) as 1|0
  try{
    const listCredentials = await systemService.listCredentials(statusCredentials)
    res.json({"success": true,"response": listCredentials})  
    return
  }catch(err){
    console.error(err)
    res.json({"error":err})  
  }
}