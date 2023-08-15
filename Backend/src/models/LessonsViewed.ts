import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface LessonsViewedInstance extends Model{
  id:number;
  date_created:string;
  student_id:number;
  course_id:number;
  module_id:number;
  lesson_id:number;
  score:number;
}

export const LessonsViewed = sequelize.define<LessonsViewedInstance>('LessonsViewed',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  course_id:{
    type:DataTypes.INTEGER
  },
  module_id:{
    type:DataTypes.INTEGER
  },
  lesson_id:{
    type:DataTypes.INTEGER
  },
  score:{
    type:DataTypes.DECIMAL
  }
},{
  tableName: 'lessons_viewed',
  timestamps:false
})