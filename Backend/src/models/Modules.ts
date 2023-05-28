import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface ModulesInstance extends Model{
  id:number;
  parent:number;
  name:string;
  icon:string;
  description:string;
  level_security:number;
  type:string;
  order:number;
  status:number;
}

export const Modules = sequelize.define<ModulesInstance>('Modules',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  parent:{
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  icon:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  level_security:{
    type:DataTypes.INTEGER
  },
  type:{
    type:DataTypes.STRING
  },
  order:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.TINYINT
  }
},{
  tableName: 'sys_modules',
  timestamps:false
})