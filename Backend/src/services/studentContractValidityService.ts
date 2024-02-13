import { StudentContractValidityType } from "../controllers/Dtos/studentContractsValidity.dto";
import { StudentsValidityContractsInstance } from "../models/StudentsValidityContracts";

class StudentContractValidity {
  async createNewStudentContract(studentContract:StudentContractValidityType){
    const [ newContract, created ] = await StudentsValidityContractsInstance.findOrCreate({
      where: { student_id: studentContract.student_id},
      defaults:studentContract 
    })
    console.log('created',created)
    return newContract.id ? newContract.id  : false;
  }




}
export default new StudentContractValidity()