import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface LevelsInstance extends Model{
  id:number;
  name:string;
  description:string;
  status:number;
}

export const Levels = sequelize.define<LevelsInstance>('Levels',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName: 'sys_levels',
  timestamps:false
})