import { Request, Response } from "express";
import { redisDelAll } from "../../config/redis"

export const clearCache = async (req:Request, res:Response) => { 
  try{
    await redisDelAll()
    res.json(true)
    return
  }catch(err){
    console.log(err)
    res.json({"error":err})  
  }
}