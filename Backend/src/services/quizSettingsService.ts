import { QuizQuestionSettingsPartialType, QuizQuestionSettingsType } from "../controllers/Dtos/quiz.dto"
import { QuizSettings, QuizSettingsInstance } from "../models/QuizSettings"


class QuizSettingsService{
  async createNewSettings(dataQuestionSettings:QuizQuestionSettingsType):Promise<boolean|QuizSettingsInstance>{
    const [newSettings,created] = await QuizSettings.findOrCreate({
      where: { quiz_id:dataQuestionSettings.quiz_id},
      defaults:dataQuestionSettings
    })
    console.info(created)
    return newSettings.id ? newSettings : false
  }
  async infoQuestionSettings(quiz_id:number):Promise<QuizSettingsInstance|null>{
    const infoQuestion = await QuizSettings.findOne({where:{quiz_id:quiz_id}})
    return infoQuestion
  }

  async editQuestionSettings(quiz_id:number,dataQuestionSettings:QuizQuestionSettingsPartialType):Promise<boolean>{
    await QuizSettings.update(dataQuestionSettings,{where:{quiz_id:quiz_id}})
    return true
  }
}
export default new QuizSettingsService();