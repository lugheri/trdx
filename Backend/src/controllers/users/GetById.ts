import { Request, Response } from 'express';
import knex from '../../database/connection'
import { ETableNames } from "../../database/ETablesNames";
import { IUser } from '../../entities/Users';

interface IRequestBody { id:number}
export const getById = async (req:Request<IRequestBody>,res:Response) => {
  const id = req.params.id
  try{
    const result = await knex<IUser>(ETableNames.users).select().where('id', '=', id);
    res.json({"success":true,"response":result})     
  }catch(err){
    console.log(err)
    res.json({"error":err})
  }
}