import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';


import { StudentsCourses } from './StudentsCourses';

export interface CoursesInstance extends Model{
  id:number;
  date_created:string;
  image:number;
  background_image:number;
  author:string;
  name:string;
  description:string;
  tags:string;
  community:number;
  completed:number;
  order:number;
  published:number;
  status:number;
}

export const Courses = sequelize.define<CoursesInstance>("Courses",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE
  },
  image:{
    type:DataTypes.INTEGER
  },
  background_image:{
    type:DataTypes.INTEGER
  },
  author:{
    type:DataTypes.STRING
  },
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  tags:{
    type:DataTypes.STRING
  },
  community:{
    type:DataTypes.INTEGER
  },
  completed:{
    type:DataTypes.INTEGER
  },
  order:{
    type:DataTypes.INTEGER
  },
  published:{
    type: DataTypes.TINYINT
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName:"courses",
  timestamps:false
})
Courses.hasOne(StudentsCourses, { foreignKey: 'course_id', sourceKey: 'id'});