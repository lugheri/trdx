import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunitySetupInstance extends Model{
  id:number;
  block_audio_message:number;
  block_media_message:number;
  block_message_message:number;
  block_access:number;
  status:number
}

export const CommunitySetup = sequelize.define<CommunitySetupInstance>("CommunitySetup",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
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
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
},{
  tableName:"community_setup",
  timestamps:false
})