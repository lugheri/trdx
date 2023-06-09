import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface StudentsInstance extends Model{
  id:number;
  since:string;
  comunity:number;
  type:string;
  photo:number;
  name:string;
  mail:string;
  born:string;
  phone:string;
  gender:string;
  password:string;
  reset:number;
  status:number;
}

export const Students = sequelize.define<StudentsInstance>("Students",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  since:{
    type:DataTypes.DATE,
  },
  comunity:{
    type:DataTypes.TINYINT
  },
  type:{
    type:DataTypes.STRING
  },
  photo:{
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  mail:{
    type:DataTypes.STRING
  },
  born:{
    type:DataTypes.DATE
  },
  phone:{
    type:DataTypes.STRING
  },
  gender:{
    type:DataTypes.STRING,
  },
  password:{
    type:DataTypes.STRING
  },
  reset:{
    type:DataTypes.TINYINT,
    defaultValue:1
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName:"students",
  timestamps:false
})