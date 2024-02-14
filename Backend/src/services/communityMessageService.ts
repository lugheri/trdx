import { CommunityMessageType } from "../controllers/Dtos/community.dto";
import { CommunityMessages } from "../models/CommunityMessage";

class CommunityMessageService{
  async newMessage(dataMessage:CommunityMessageType){
    const data = await CommunityMessages.create(dataMessage)
    return data ? true : false
  }

  async listMessages(page:number){
    const p = page - 1
    const qtdRegPage = 15
    const offset = qtdRegPage * p 
    const messages = await CommunityMessages.findAll({
      where: { status: 1 },
      order:[['id','ASC']],
      offset:offset,
      limit:qtdRegPage
    })
    return messages
  }

  async getUserLastMessage(){
    const message = await CommunityMessages.findOne({
      attributes:['user_id'],
      where: { status: 1 },
      order:[['id','DESC']],
      limit:1
    })
    return message ? message.user_id : 0
  }

  async editMessages(message_id:number,dataMessage:CommunityMessageType){}
}
export default new CommunityMessageService()