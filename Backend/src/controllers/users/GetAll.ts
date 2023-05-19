import { Request, Response } from 'express';
import knex from '../../database/connection'
import { ETableNames } from "../../database/ETablesNames";
import { User } from '../../models/Users';


export const getAll = async (req:Request,res:Response) => {
  
  const page:number = req.body.page  === undefined ? 1 : req.body.page
  const order:'ASC'|'DESC' = req.body.order === undefined ? 'ASC' : req.body.order
  const orderedBy:string = req.body.orderedBy === undefined ? 'id' : req.body.orderedBy
  const status:number = req.body.status === undefined ? 1 : req.body.status

  const p = page-1
  const qtdRegPage = 30
  const offset = qtdRegPage * p 
  try{
    const users = await User.findAll({
      where: {status: status},
      order:[[orderedBy,order]],
      offset:offset,
      limit:qtdRegPage
    })
    res.json({"success":true,"response":users})
  }catch(err){
    console.log(err)
    res.json({"error":err})
  }
}