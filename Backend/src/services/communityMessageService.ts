import { redisDel, redisGet, redisSet } from "../config/redis";
import { CommunityBlockedMembersType, CommunityMediaType, CommunityMessageType } from "../controllers/Dtos/community.dto";
import { CommunityBlockedMembers, CommunityBlockedMembersInstance } from "../models/CommunityBlockedMembers";
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

  async editMessages(message_id:number,dataMessage:CommunityMessageType){
    await CommunityMessages.update(dataMessage,{where:{id:message_id}})
    return true
  }

  //Manager
  async blockingMember(dataBlock:CommunityBlockedMembersType){
    const redisKey=`Community:blockedMember:[${dataBlock.member_id}]`
    await redisDel(redisKey)
    await CommunityBlockedMembers.findOrCreate({
      where: { member_id: dataBlock.member_id},
      defaults:dataBlock
    });
    return true
  }

  async editBlockingMember(memberId:number,dataBlock:CommunityBlockedMembersType){
    const redisKey=`Community:blockedMember:[${memberId}]`
    await redisDel(redisKey)
    await CommunityBlockedMembers.update(dataBlock,{where:{member_id:memberId}})
    return true
  }

  async getDataBlockMember(memberId:number):Promise<CommunityBlockedMembersInstance|null>{
    const redisKey=`Community:blockedMember:[${memberId}]`
    const memberBlockRedis = await redisGet(redisKey)
    if(memberBlockRedis!==null){return memberBlockRedis}
    const dataBlock = await CommunityBlockedMembers.findOne({where:{member_id:memberId}})
    await redisSet(redisKey,dataBlock ? dataBlock : null)
    return dataBlock ? dataBlock : null
  }

  async listBlockingMembers(){    
    const members = await CommunityBlockedMembers.findAll();
    return members
  }

}
export default new CommunityMessageService()