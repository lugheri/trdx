import { StudentsQuizType } from "../controllers/Dtos/quiz.dto"
import { StudentsQuiz, StudentsQuizInstance } from "../models/StudentQuiz"

class StudentsQuizService{
  async createData(dataStudentsQuiz:StudentsQuizType):Promise<boolean|StudentsQuizInstance>{
    const [newData,created] = await StudentsQuiz.findOrCreate({
      where: { quiz_id:dataStudentsQuiz.quiz_id,student_id:dataStudentsQuiz.student_id},
      defaults:dataStudentsQuiz
    })
    console.info(created)
    return newData.id ? newData : false
  }
  async infoStudentQuiz(quiz_id:number):Promise<StudentsQuizInstance|null>{
    const infoStudentQuiz = await StudentsQuiz.findOne({where:{quiz_id:quiz_id}})
    return infoStudentQuiz
  }

  async editStudentQuiz(quiz_id:number,student_id:number,dataStudentsQuiz:StudentsQuizType):Promise<boolean>{
    await StudentsQuiz.update(dataStudentsQuiz,{where:{quiz_id:quiz_id,student_id:student_id}})
    return true
  }
}
export default new StudentsQuizService();