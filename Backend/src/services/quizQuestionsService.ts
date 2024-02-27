import { QuizQuestionType } from "../controllers/Dtos/quiz.dto";
import { QuizQuestion, QuizQuestionInstance } from "../models/QuizQuestions";

class QuizQuestionsService{
  async createNewQuestion(dataQuestion:QuizQuestionType):Promise<null|QuizQuestionInstance>{
    const [newQuestion,created] = await QuizQuestion.findOrCreate({
      where: { quiz_id:dataQuestion.quiz_id, type_question:dataQuestion.type_question, question:dataQuestion.question,status:1},
      defaults:dataQuestion
    })
    console.info(created)
    return newQuestion.id ? newQuestion : null
  }

  async lastOrderQuestion(quizId:number):Promise<number>{
    const listQuestions = await QuizQuestion.findOne({
      attributes:['order'],
      where:{quiz_id:quizId,status:1},
      order:[['order','DESC']],
    })
    return listQuestions ? listQuestions.order : 0
  }

  async listQuestions(quizId:number):Promise<QuizQuestionInstance[]>{
    const listQuestions = await QuizQuestion.findAll({
      where:{quiz_id:quizId,status:1},
      order:[['order','ASC']],
    })
    return listQuestions
  }

  async infoQuestion(questionId:number):Promise<QuizQuestionInstance|null>{
    const infoQuestion = await QuizQuestion.findByPk(questionId)
    return infoQuestion
  }

  async editQuestion(questionId:number,dataQuestion:QuizQuestionType):Promise<boolean>{
    await QuizQuestion.update(dataQuestion,{where:{id:questionId}})
    return true
  }
}
export default new QuizQuestionsService();