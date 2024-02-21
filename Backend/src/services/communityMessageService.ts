import { CommunityMediaType, CommunityMessageType } from "../controllers/Dtos/community.dto";
import { CommunityMedia } from "../models/CommunityMedia";
import { CommunityMessages } from "../models/CommunityMessage";

class CommunityMessageService{
  async newMessage(dataMessage:CommunityMessageType){
    const data = await CommunityMessages.create(dataMessage)
    return data ? true : false
  }

  async newMediaMessage(dataMediaMessage:CommunityMediaType){
    const data = await CommunityMedia.create(dataMediaMessage)
    return data ? data.id : null
  }


  async listMessages(page:number){
    const totalMessages = await CommunityMessages.count({
      where: { status: 1 }
    })
        
    
    const qtdRegPage = 30
    const calcInit = totalMessages-(qtdRegPage*page)
    const init = calcInit < 0 ? 0 : calcInit
    const messages = await CommunityMessages.findAll({
      where: { status: 1 },
      order:[['id','ASC']],
      offset:init,
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

  async loadMedia(mediaId:number){
    const data = await CommunityMedia.findByPk(mediaId)
    return data
  }

  async editMessages(message_id:number,dataMessage:CommunityMessageType){}
}
export default new CommunityMessageService()