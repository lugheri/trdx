import { Request, Response } from 'express';
import knex from '../../database/connection'
import { ETableNames } from "../../database/ETablesNames";
import { IUser } from '../../entities/Users';

interface IRequestBody { 
  page:number;
  order:'ASC'|'DESC';
  orderedBy:string;
  status?:number;
}
export const getAll = async (req:Request<IRequestBody>,res:Response) => {
  
  const page = req.body.page  === undefined ? 1 : req.body.page
  const order = req.body.order === undefined ? 'ASC' : req.body.order
  const orderedBy = req.body.orderedBy === undefined ? 'id' : req.body.orderedBy
  const status = req.body.status === undefined ? 1 : req.body.status

  const p = page-1
  const qtdRegPage = 30
  const offset = qtdRegPage * p 
  try{
    const result = await knex<IUser>(ETableNames.users).select().where('status', '=', status).limit(qtdRegPage).offset(offset).orderBy(orderedBy,order);
    res.json({"success":true,"response":result})
  }catch(err){
    console.log(err)
    res.json({"error":err})
  }
}