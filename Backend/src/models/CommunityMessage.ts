import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityMessagesInstance extends Model{
  id:number;
  date_created:string;
  is_student:number;
  answer_message:number;
  user_id:number;
  user_photo:number;
  user_name:string;
  user_last_message:number;
  message:string;
  media:number;
  public:number;
  status:number;
}

export const CommunityMessages = sequelize.define<CommunityMessagesInstance>("CommunityMessages",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  is_student:{
    type:DataTypes.INTEGER
  },
  answer_message:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  user_id:{
    type:DataTypes.INTEGER
  },
  user_photo:{
    type:DataTypes.INTEGER
  },
  user_name:{
    type:DataTypes.STRING
  },
  user_last_message:{
    type:DataTypes.INTEGER
  },
  message:{
    type:DataTypes.STRING
  },
  media:{
    type:DataTypes.INTEGER
  },
  public:{
    type:DataTypes.INTEGER,
    defaultValue:1
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
},{
  tableName:"community_messages",
  timestamps:false
})