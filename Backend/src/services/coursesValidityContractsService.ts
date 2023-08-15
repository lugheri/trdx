import { CoursesValidityContracts, CoursesValidityContractsInstances } from "../models/CoursesValidityContracts";

class CoursesValidityContractsService{
  async validityCourse(courseId:number,studentId:number):Promise<CoursesValidityContractsInstances|null>{
    const validity = await CoursesValidityContracts.findOne({
      where: {student_id:studentId, course_id:courseId },
      order:[['start_validity','DESC']],
    })
    return validity
  } 
}

export default new CoursesValidityContractsService();