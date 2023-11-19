import { StudentType, StudentPartialType, PaginationStudentType, SearchStudentType } from "../controllers/Dtos/student.dto";
import { Students, StudentsInstance } from "../models/Students"
import { Op } from "sequelize"
import { StudentsLogins, StudentsLoginsInstance } from "../models/StudentsLogins";
import { redisDel, redisGet, redisSet } from "../config/redis";

class StudentsService{
  async createNewStudent(studentData:StudentType){
    const [newStudent,created] = await Students.findOrCreate({
      where: { mail: studentData.mail},
      defaults:studentData
    });
    console.info('created',created);
    return newStudent.id ? newStudent.id  : false;
  }
  async editStudent(studentId:number,studentData:StudentPartialType):Promise<boolean>{   
    await redisDel(`infoStudent:[${studentId}]`)
    await Students.update(studentData,{where:{id:studentId}})   
    return true;
  }
  async removeStudent(studentId:number):Promise<boolean>{
    await redisDel(`infoStudent:[${studentId}]`)
    await Students.destroy({where:{id:studentId}})
    return true;
  }
  async getStudent(studentId:number):Promise<boolean | StudentsInstance >{
    const redisKey = `infoStudent:[${studentId}]`
    const infoStudentRedis = await redisGet(redisKey)
    if(infoStudentRedis!==null){ return infoStudentRedis }   
    const student = await Students.findByPk(studentId)
    const infoStudent = student ? student : false
    await redisSet(redisKey,infoStudent)
    return infoStudent
  }

  async checkCommunityStatusStudent(studentId:number):Promise<boolean | StudentsInstance >{
    const redisKey = `typeAccessStudent:[${studentId}]`
    const communityStatusStudentRedis = await redisGet(redisKey)
    if(communityStatusStudentRedis!==null){ return communityStatusStudentRedis }   
    const access = await Students.findOne({
      attributes:['community'],
      where:{id:studentId,status:1},
      limit:1
    })
    
    const communityStatusStudent = access ? access : false
    await redisSet(redisKey,communityStatusStudent)
    return communityStatusStudent
  }

  async getLastAccessStudent(studentId:number):Promise<StudentsLoginsInstance | null>{
    const lastAccess = await StudentsLogins.findOne({
      where:{student_id:studentId},
      order:[['id','DESC']],
      limit:1
    })
    return lastAccess
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

