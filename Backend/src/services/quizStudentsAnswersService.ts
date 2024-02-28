import { QuizStudentAnswerType } from "../controllers/Dtos/quiz.dto"
import { QuizStudentsAnswers, QuizStudentsAnswersInstance } from "../models/QuizStudentsAnswers"

class QuizStudentsAnswersService{
  async newAnswerQuizStudent(dataAnswer:QuizStudentAnswerType):Promise<boolean|QuizStudentsAnswersInstance>{
    const [newAnswer,created] = await QuizStudentsAnswers.findOrCreate({
      where: { question_id:dataAnswer.question_id,student_id:dataAnswer.student_id},
      defaults:dataAnswer
    })
    console.info(created)
    return newAnswer.id ? newAnswer : false
  }
  async infoQuizStudentAnswer(answerId:number):Promise<QuizStudentsAnswersInstance|null>{
    const infoQuestion = await QuizStudentsAnswers.findOne({where:{id:answerId}})
    return infoQuestion
  }

  async editQuizStudentAnswer(answerId:number,dataAnswer:QuizStudentAnswerType):Promise<boolean>{
    await QuizStudentsAnswers.update(dataAnswer,{where:{id:answerId}})
    return true
  }
}
export default new QuizStudentsAnswersService();