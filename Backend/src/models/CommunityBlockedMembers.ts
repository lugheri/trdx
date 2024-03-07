import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityBlockedMembersInstance extends Model{
  id:number;
  date:string;
  user_block_responsible:number;
  member_id:number;
  block_audio_message:number;
  block_media_message:number;
  block_message_message:number;
  block_access:number;
}

export const CommunityBlockedMembers = sequelize.define<CommunityBlockedMembersInstance>("CommunityBlockedMembers",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  user_block_responsible:{
    type:DataTypes.INTEGER
  },
  member_id:{
    type:DataTypes.INTEGER
  },
  block_audio_message:{
    type:DataTypes.TINYINT
  },
  block_media_message:{
    type:DataTypes.TINYINT
  },
  block_message_message:{
    type:DataTypes.TINYINT,
    defaultValue:1
  },
  block_access:{
    type:DataTypes.TINYINT
  }
},{
  tableName:"community_blocked_members",
  timestamps:false
})