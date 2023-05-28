import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CredentialsInstance extends Model{
  id:number;
  level_id:number;
  name:string;
  description:string;
  status:number;
}

export const Credentials = sequelize.define<CredentialsInstance>('Credentials',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  level_id:{
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
  tableName: 'sys_credentials',
  timestamps:false
})