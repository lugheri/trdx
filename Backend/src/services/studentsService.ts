import { Students, StudentsInstance } from "../models/Students"
import { Op } from "sequelize"

class StudentsService{
  //Create
  async create(userdata: { [key: string]: number | string } ):Promise<StudentsInstance>{
    const student = await Students.create(userdata)
    return student
  }
  //Read
  async getStudents(page:number,status:number):Promise<StudentsInstance[]>{
    const p = page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p
    const students = await Students.findAll({where: {status: status},
                                             offset:offset,
                                             limit:qtdRegPage})
    return students
  }
  async getUserById(userId:number):Promise<StudentsInstance | null>{
    const student = await Students.findByPk(userId)
    return student
  }
  async search(params:string,
                value:string|number,
                 page:number,
                order:'ASC'|'DESC',
            orderedBy:string,
               status:number):Promise<StudentsInstance[]>{
    const p = page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p
    const students = await Students.findAll({where: {[params]: { [Op.like]: `%${value}%`},status:status},
                                            order:[[orderedBy,order]],
                                            offset:offset,
                                             limit:qtdRegPage})
    return students

  }
  //Update
  //Delete
}
export default new StudentsService()