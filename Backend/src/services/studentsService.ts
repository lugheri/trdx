import { StudentType, StudentPartialType, PaginationStudentType, SearchStudentType } from "../controllers/Dtos/student.dto";
import { Students, StudentsInstance } from "../models/Students"
import { Op } from "sequelize"
import { StudentsLogins, StudentsLoginsInstance } from "../models/StudentsLogins";
import { redisDel, redisGet, redisSet } from "../config/redis";

class StudentsService{
  async createNewStudent(studentData:StudentType){
    await redisDel(`totalStudents[1]`)
    await redisDel(`totalStudents[0]`)
    const [newStudent,created] = await Students.findOrCreate({
      where: { mail: studentData.mail},
      defaults:studentData
    });
    console.info('created',created);
    return newStudent.id ? newStudent.id  : false;
  }
  async getStudent(studentId:number):Promise<null | StudentsInstance >{
    const redisKey = `infoStudent:[${studentId}]`
    const infoStudentRedis = await redisGet(redisKey)
    if(infoStudentRedis!==null){ return infoStudentRedis }   
    const student = await Students.findByPk(studentId)
    const infoStudent = student ? student : null
    await redisSet(redisKey,infoStudent)
    return infoStudent
  }
  async editStudent(studentId:number,studentData:StudentPartialType):Promise<boolean>{   
    await redisDel(`infoStudent:[${studentId}]`)
    await Students.update(studentData,{where:{id:studentId}})   
    return true;
  }
  async removeStudent(studentId:number):Promise<boolean>{
    await redisDel(`infoStudent:[${studentId}]`)
    await redisDel(`totalStudents[1]`)
    await redisDel(`totalStudents[0]`)
    await Students.destroy({where:{id:studentId}})
    return true;
  }
  async listStudent(status:number,page:number,filter:null|number,orderedBy:string,order:'ASC'|'DESC'):Promise<StudentsInstance[]>{
    const p = page-1
    const qtdRegPage = 15
    const offset = qtdRegPage * p 
    const filterCondition = filter ? { nome: filter } : {};
    const listStudents = await Students.findAll({
      where: {status: status, ...filterCondition},
      order:[[orderedBy,order]],
      offset:offset,
      limit:qtdRegPage
    })
    return listStudents
  } 
  async searchStudents(status:number,page:number,params:string,filter:null|number,orderedBy:string,order:'ASC'|'DESC'):Promise<StudentsInstance[]>{
    const p = page-1
    const qtdRegPage = 15
    const offset = qtdRegPage * p 
    const filterCondition = filter ? { community: filter } : {};
    const listStudents = await Students.findAll({
      where:{status:status,...filterCondition, 
        [Op.or]: [ { name: { [Op.like]: `%${params}%`} },{ mail: { [Op.like]: `%${params}%`} }]
      },
      order:[[orderedBy,order]],
      offset:offset,
      limit:qtdRegPage
    })
    return listStudents
  } 
  async totalStudents(status:number):Promise<number>{
    const redisKey = `totalStudents[${status}]`
    const totalStudentsRedis = await redisGet(redisKey)
    if(totalStudentsRedis!=null){return totalStudentsRedis}
    const totalStudents = await Students.count({
      where:{status:status}
    })
    await redisSet(redisKey,totalStudents)
    return totalStudents
  }

  async totalCommunityMembers():Promise<number>{
    const redisKey = `totalCommunityMembers`
    const totalCommunityMembersRedis = await redisGet(redisKey)
    if(totalCommunityMembersRedis!=null){return totalCommunityMembersRedis}
    const totalMembers = await Students.count({
      where:{community:1,status:1}
    })
    await redisSet(redisKey,totalMembers)
    return totalMembers
  }


  async totalFilteredStudents(params:string,value:string,filter:null|number,status:number):Promise<number>{
    const filterCondition = filter ? { community: filter } : {};
    const paramsSearch = params ? {[params]: { [Op.like]: `%${value}%`}} : {};
    const totalStudents = await Students.count({
      where:{status:status,...filterCondition,...paramsSearch}
    })
   
    return totalStudents
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

  
  
  async searchStudentsOld(searchParams:SearchStudentType):Promise<StudentsInstance[]>{
    const p = searchParams.page-1
    const qtdRegPage = 30
    const offset = qtdRegPage * p
    const students = await Students.findAll({where: {[searchParams.params]: { [Op.like]: `%${searchParams.value}%`},status:searchParams.status},
                                            order:[[searchParams.orderedBy,searchParams.order]],
                                            offset:offset,
                                             limit:qtdRegPage})
    return students
  }






  

  async studentsCommunity(){    
    const students = await Students.findAll({where: {community:1,status:1}})
    return students
  }


  
}
export default new StudentsService()

