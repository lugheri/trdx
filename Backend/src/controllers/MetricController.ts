import { Request, Response } from "express";
import metricsServices from "../services/metricsServices";
import coursesValidityContractsService from "../services/coursesValidityContractsService";
import studentContractValidityService from "../services/studentContractValidityService";
import { StudentContractValidityDTO } from "./Dtos/studentContractsValidity.dto";
import moment from "moment";
import { redisGet } from "../config/redis";

class MetricController{
  async totalStudents(req:Request,res:Response){
    const students = await metricsServices.countStudents(0,null)
    const community = await metricsServices.countStudents(1,null)
    res.json({'students':students,'community':community})
  }

  async activesNow(req:Request,res:Response){
    const sessions : null|any[] = await redisGet('activeSessions')
    res.json(sessions == null ? 0 : sessions.length)
  }

  async newStudentsLast20days(req:Request,res:Response){
    const date = moment();
    const today = date.format('YYYY-MM-DD')      
    const init = moment(today, 'YYYY-MM-DD');
    let initDate = init.subtract(20, 'days').format('YYYY-MM-DD')
    const dates : string[] = []
    const students: number[] = []
    const community: number[] = []
    for(let i = 0; i<=20; ++i ){      
      dates.push(moment(initDate).format('DD/MM'))
      students.push(await metricsServices.countStudents(0,initDate))
      community.push(await metricsServices.countStudents(1,initDate))
      const day = moment(initDate, 'YYYY-MM-DD');
      initDate = day.add(1, 'days').format('YYYY-MM-DD')
    }
    res.json({dates,students,community})
  }
  async accessExpireds(req:Request,res:Response){
    //Checking Status 
    try{
      const studentsWithoutStatus = await metricsServices.checkExpiredAccess()
      for(const student of studentsWithoutStatus){
        const studentId = student.id
        //Get Contract Student
        const contract = await coursesValidityContractsService.endDataContractStudent(studentId)
        //Add Student Contract
        if(contract !== null){
          const dataContract = StudentContractValidityDTO.safeParse({
            student_id:studentId,
            payment_cycle:contract.payment_cycle,
            expired_in:contract.end_validity,
            status:1
          })
          if(dataContract.success){
            await studentContractValidityService.createNewStudentContract(dataContract.data)
          }
        }
      }
      //Get Students by Status
      const actives = await metricsServices.studentStatus('actives')
      const inactive = await metricsServices.studentStatus('inactive')
      const expired = await metricsServices.studentStatus('expired')
      const endContract = await metricsServices.studentStatus('endContract')

      res.json({actives:actives,inactive:inactive,expired:expired,endContract:endContract})



    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
  async satisfactionChart(req:Request,res:Response){
    try{
      const satisfaction = await metricsServices.satisfactionCourses()
      const courses : string[] = []
      const average : number[] = []
      for(const s of satisfaction){
        courses.push(s.name)
        const media = parseFloat(s.media === null ? 0:s.media).toFixed(1)
        average.push(parseFloat(media))
      }
      res.json({"success": true,"response": [{"courses":courses},{"average":average}]})  
      return
    }catch(err){
      console.error(err)
      res.json({"error":err})  
    }
  }
}
export default new MetricController()
