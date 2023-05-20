import {Request, Response} from 'express';
import StudentsService from '../../services/studentsService'
import { StudentsInstance } from '../../models/Students';

export const list = async (req: Request, res: Response) => {
  const page = parseInt(req.params.page)
  const status = parseInt(req.params.status)
  try{
    const students = await StudentsService.getStudents(page,status)
    res.json({"success":true,"response":students})
  }catch(err:any){
    console.log(err)
    res.json({"error":err.message})
  }

}

export const search = async (req: Request, res: Response) => {
  //Finders
  const params:string = req.body.params
  const value:string|number = req.body.value
  //Pagination
  const page:number = req.body.page  === undefined ? 1 : req.body.page
  const order:'ASC'|'DESC' = req.body.order === undefined ? 'ASC' : req.body.order
  const orderedBy:string = req.body.orderedBy === undefined ? 'id' : req.body.orderedBy
  console.log("req.body.status",req.body.status)
  const status:number = req.body.status === undefined ? 1 : req.body.status
  console.log("status",status)
  try{
    const students = await StudentsService.search(params, value, page, order, orderedBy, status)
    res.json({"success":true,"response":students})
  }catch(err:any){
    console.log(err)
    res.json({"error":err.message})
  }
  

}

export const info = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id)
  try{
    const student = await StudentsService.getUserById(userId)
    res.json({"success":true,"response":student})
  }catch(err:any){
    console.log(err)
    res.json({"error":err.message})
  }
}