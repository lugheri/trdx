import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityStickersInstance extends Model{
  id:number;
  date_created:string;
  name:string;
  description:string;
  file:string;
  status:number;
}

export const CommunityStickers = sequelize.define<CommunityStickersInstance>("CommunityStickers",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  file:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
},{
  tableName:"community_stickers",
  timestamps:false
})