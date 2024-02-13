import { AddContractValidityType } from "../controllers/Dtos/student.dto";
import { CoursesValidityContracts, CoursesValidityContractsInstances } from "../models/CoursesValidityContracts";

class CoursesValidityContractsService{
  async validityCourse(courseId:number,studentId:number):Promise<CoursesValidityContractsInstances|null>{
    const validity = await CoursesValidityContracts.findOne({
      where: {student_id:studentId, course_id:courseId },
      order:[['start_validity','DESC'],['id','DESC']],
    })
    return validity
  } 

  async allContrats(courseId:number,studentId:number):Promise<CoursesValidityContractsInstances[]>{
    const allContrats = await CoursesValidityContracts.findAll({
      where: {student_id:studentId, course_id:courseId },
      order:[['id','DESC']],
    })
    return allContrats
  }

  async endDataContractStudent(studentId:number){
    const dataContract = await CoursesValidityContracts.findOne({
      where:{student_id:studentId},
      order:[['end_validity','DESC']]
    })
    return dataContract
  }

  async addContract(dataContract:AddContractValidityType):Promise<CoursesValidityContractsInstances>{
    const newContract = await CoursesValidityContracts.create(dataContract)
    return newContract
  }

  async removeContract(contractId:number):Promise<boolean>{
    await CoursesValidityContracts.destroy({where:{id:contractId}})
    return true
  }
}

export default new CoursesValidityContractsService();