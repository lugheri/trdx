import moment from "moment";
import { sequelize } from "../instances/mysql"
import { QueryTypes } from "sequelize"
class metricsService{
  async countStudents(community:1|0,date:string|null):Promise<number>{
    const since = date ? `AND since LIKE '${date}%'` : ''
    const query = `SELECT COUNT(id) as total 
                     FROM students
                    WHERE community=${community} AND status=1 ${since}`
    const students = await sequelize.query(query,{type: QueryTypes.SELECT}) as any[]    
    return students[0].total
  }
  async studentStatus(status:'expired'|'endContract'|'actives'|'inactive'):Promise<number>{
    const date = moment();
    const today = date.format('YYYY-MM-DD')  
    const init = moment(today, 'YYYY-MM-DD');
    const alertEnd = init.add(15, 'days').format('YYYY-MM-DD')
   
    const where = status == "expired" ? `c.expired_in<'${today}'` :
                status == "endContract" ? `c.expired_in<'${alertEnd}' AND c.expired_in>'${today}'` :
                status == "actives" ? 's.status=1' : 's.status=0'

    const query = `SELECT COUNT(s.id) as total 
                     FROM students AS s
                     LEFT JOIN students_validity_contracts AS c ON s.id=c.student_id
                    WHERE ${where}`
    const students = await sequelize.query(query,{type: QueryTypes.SELECT}) as any[]    
    return students[0].total
  }
  

  async checkExpiredAccess(){
    const query = `SELECT s.id FROM students AS s 
                LEFT JOIN students_validity_contracts AS c ON s.id=c.student_id
                    WHERE s.status=1 AND c.student_id is null`
    const students = await sequelize.query(query,{type: QueryTypes.SELECT}) as any[]    
    return students
  }

  async satisfactionCourses(){
    const query = `SELECT course_id,c.name, AVG(score) as media 
                     FROM lessons_viewed AS l
                     JOIN courses AS c ON l.course_id=c.id
                 GROUP BY course_id`
    const satisfaction = await sequelize.query(query,{
      type: QueryTypes.SELECT
    }) as any[]    
    return satisfaction
  }
}
export default new metricsService()