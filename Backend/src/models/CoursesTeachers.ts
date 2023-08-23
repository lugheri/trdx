import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CoursesTeachersInstance extends Model{
  id:number;
  date_created:string;
  photo:number;
  name:string;
  description:string;
  status:number;
}

export const CoursesTeachers = sequelize.define<CoursesTeachersInstance>('CoursesTeachers',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  photo:{
    type:DataTypes.INTEGER
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'courses_teachers',
  timestamps:false
})