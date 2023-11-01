import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CommunityHomeButtonsInstance extends Model{
  id:number;
  name:string;
  link:string;
  order:number;
  status:number;
}

export const CommunityHomeButtons = sequelize.define<CommunityHomeButtonsInstance>('CommunityHomeButtonsInstance',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  link:{
    type:DataTypes.STRING
  },
  order:{
    type:DataTypes.NUMBER
  },
  status:{
    type:DataTypes.NUMBER,
    defaultValue:1
  }
},{
  tableName:'community_home_buttons',
  timestamps:false
})

