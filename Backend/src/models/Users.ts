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
  logged:number;
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
    type: DataTypes.INTEGER
  },
  name:{
    type: DataTypes.STRING
  },
  mail:{
    type: DataTypes.STRING
  },
  level:{
    type: DataTypes.INTEGER
  },
  password:{
    type: DataTypes.STRING
  },
  reset:{
    type: DataTypes.TINYINT
  },
  logged:{
    type: DataTypes.TINYINT
  },
  status:{
    type: DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName: "users",
  timestamps: true
})