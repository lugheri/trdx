import { QuizQuestionOptionsType } from "../controllers/Dtos/quiz.dto"
import { QuizQuestionOptions, QuizQuestionOptionsInstance } from "../models/QuizQuestionsOptions"

class QuizQuestionsOptionsService{
  async createNewQuestionOptions(dataQuestionOption:QuizQuestionOptionsType):Promise<boolean|QuizQuestionOptionsInstance>{
    const [newQuestionOptions,created] = await QuizQuestionOptions.findOrCreate({
      where: { question_id:dataQuestionOption.question_id, answer:dataQuestionOption.answer, status:1},
      defaults:dataQuestionOption
    })
    console.info(created)
    return newQuestionOptions.id ? newQuestionOptions : false
  }

  
  async lastOrderOptions(questionId:number):Promise<number>{
    const listOptions = await QuizQuestionOptions.findOne({
      attributes:['order'],
      where:{question_id:questionId,status:1},
      order:[['order','DESC']],
    })
    return listOptions ? listOptions.order : 0
  }

  async listQuestionsOptions(questionId:number):Promise<QuizQuestionOptionsInstance[]>{
    const listQuestionsOptions = await QuizQuestionOptions.findAll({
      where:{question_id:questionId,status:1},
      order:[['order','ASC']],
    })
    return listQuestionsOptions
  }

  async infoQuestionOption(questionOptionId:number):Promise<QuizQuestionOptionsInstance|null>{
    const infoQuestionOption = await QuizQuestionOptions.findByPk(questionOptionId)
    return infoQuestionOption
  }

  async editQuestionOption(questionOptionId:number,dataQuestionOption:QuizQuestionOptionsType):Promise<boolean>{
    await QuizQuestionOptions.update(dataQuestionOption,{where:{id:questionOptionId}})
    return true
  }

  async editQuestionOptionByQuestionId(questionId:number,dataQuestionOption:QuizQuestionOptionsType):Promise<boolean>{
    await QuizQuestionOptions.update(dataQuestionOption,{where:{question_id:questionId}})
    return true
  }
}
export default new QuizQuestionsOptionsService();