import { QuizStudentsGradeType } from "../controllers/Dtos/quiz.dto"
import { QuizStudentsGrade, QuizStudentsGradeInstance } from "../models/QuizStudentsGrade"


class QuizStudentsGradeService{
  async createData(dataStudentsQuiz:QuizStudentsGradeType):Promise<boolean|QuizStudentsGradeInstance>{
    const [newData,created] = await QuizStudentsGrade.findOrCreate({
      where: { quiz_id:dataStudentsQuiz.quiz_id,student_id:dataStudentsQuiz.student_id},
      defaults:dataStudentsQuiz
    })
    console.info(created)
    return newData.id ? newData : false
  }
  async gradeQuizStudent(quiz_id:number,student_id:number,):Promise<QuizStudentsGradeInstance|null>{
    const infoStudentQuiz = await QuizStudentsGrade.findOne({where:{quiz_id:quiz_id,student_id:student_id}})
    return infoStudentQuiz
  }

  async editStudentQuiz(quiz_id:number,student_id:number,dataStudentsQuiz:QuizStudentsGradeType):Promise<boolean>{
    await QuizStudentsGrade.update(dataStudentsQuiz,{where:{quiz_id:quiz_id,student_id:student_id}})
    return true
  }
}
export default new QuizStudentsGradeService();