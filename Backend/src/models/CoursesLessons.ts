import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import { LessonsViewed } from './LessonsViewed';

export interface CoursesLessonsInstance extends Model{
  id:number;
  course_id:number;
  module_id:number;
  date_created:string;
  type_lesson:string;
  max_time:string;
  top_score:number;
  teacher_id:number;
  type_content:string;
  link:string;
  video_platform:string;
  image:number;
  name:string;
  description:string;
  tags:string;
  order:number;
  visibility:number;
  status:number;
}

export const CoursesLessons = sequelize.define<CoursesLessonsInstance>('CoursesLessons',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  course_id:{
    type:DataTypes.INTEGER,
  },
  module_id:{
    type:DataTypes.INTEGER,
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  type_lesson:{
    type:DataTypes.STRING
  },
  max_time:{
    type:DataTypes.STRING
  },
  top_score:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  teacher_id:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  type_content:{
    type:DataTypes.STRING
  },
  link:{
    type:DataTypes.STRING
  },
  video_platform:{
    type:DataTypes.STRING
  },
  image:{
    type:DataTypes.INTEGER,
    defaultValue:0
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
  order:{
    type:DataTypes.INTEGER
  },
  visibility:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'courses_lessons',
  timestamps:false
})
CoursesLessons.hasOne(LessonsViewed, { foreignKey: 'lesson_id', sourceKey: 'id'});