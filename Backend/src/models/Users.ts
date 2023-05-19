import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql'

export interface UserInstance extends Model{
  id:number;
  photo:number;
  name:string;
  mail:string;
  level:number;
  password:string;
  reset:number;
  status:number;
  created_at:string;
  updated_at:string;
}

export const User = sequelize.define<UserInstance>("User",{
  id:{
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  photo:{
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name:{
    primaryKey: true,
    type: DataTypes.STRING
  },
  mail:{
    primaryKey: true,
    type: DataTypes.STRING
  },
  level:{
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  password:{
    primaryKey: true,
    type: DataTypes.STRING
  },
  reset:{
    primaryKey: true,
    type: DataTypes.TINYINT
  },
  status:{
    primaryKey: true,
    type: DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName: "users",
  timestamps: true
})