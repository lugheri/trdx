import { StudentType, StudentPartialType, PaginationStudentType, SearchStudentType } from "../controllers/Dtos/student.dto";
import { Students, StudentsInstance } from "../models/Students"
import { Op } from "sequelize"

class StudentsService{
  async createNewStudent(studentData:StudentType):Promise<boolean | StudentsInstance >{
    const [newStudent,created] = await Students.findOrCreate({
      where: { name: studentData.mail},
      defaults:studentData
    });
    console.log('created',created);
    return newStudent.id ? newStudent : false;
  }
  async editStudent(studentId:number,studentData:StudentPartialType):Promise<boolean>{   
    await Students.update(studentData,{where:{id:studentId}})   
    return true;
  }
  async removeStudent(studentId:number):Promise<boolean>{
    await Students.destroy({where:{id:studentId}})
    return true;
  }
  async getStudent(studentId:number):Promise<boolean | StudentsInstance >{
    const student = await Students.findByPk(studentId)
    return student ? student : false
  }
  async listStudent(pagination:PaginationStudentType):Promise<StudentsInstance[]>{
    const p = pagination.page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p 

    const listStudents = await Students.findAll({
      where: {status: pagination.status},
      order:[[pagination.orderedBy,pagination.order]],
      offset:offset,
      limit:qtdRegPage
    })
    return listStudents
  } 
  
  async searchStudents(searchParams:SearchStudentType):Promise<StudentsInstance[]>{
    const p = searchParams.page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p
    const students = await Students.findAll({where: {[searchParams.params]: { [Op.like]: `%${searchParams.value}%`},status:searchParams.status},
                                            order:[[searchParams.orderedBy,searchParams.order]],
                                            offset:offset,
                                             limit:qtdRegPage})
    return students
  }
}
export default new StudentsService()

