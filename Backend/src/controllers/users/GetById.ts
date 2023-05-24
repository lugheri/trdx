import { Request, Response } from 'express';
import knex from '../../database/connection'
import { ETableNames } from "../../database/ETablesNames";
import { User } from '../../models/Users';

interface IRequestBody { id:number}
export const getById = async (req:Request<IRequestBody>,res:Response) => {
  const id = req.params.id
  try{
    const users = await User.findAll({where: {id: id}})
    res.json({"success":true,"response":users})
  }catch(err){
    console.log(err)
    res.json({"error":err})
  }
}