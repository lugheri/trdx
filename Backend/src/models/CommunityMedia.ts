import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityMediaInstance extends Model{
  id:number;
  date_created:string;
  user_id:number;
  directory:string;
  type_media:string;
  status:number;
}

export const CommunityMedia = sequelize.define<CommunityMediaInstance>("CommunityMedia",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  user_id:{
    type:DataTypes.INTEGER
  },
  directory:{
    type:DataTypes.STRING
  },
  type_media:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.INTEGER,
    defaultValue:1
  }
},{
  tableName:"community_media",
  timestamps:false
})