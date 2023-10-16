import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface LessonsAttachmentsInstance extends Model{
  id:number;
  date_created:string;
  course_id:number;
  module_id:number;
  lesson_id:number;
  name:string;
  description:string;
  type:string;
  material:string;
  status:number;
}

export const LessonsAttachments = sequelize.define<LessonsAttachmentsInstance>('LessonsAttachments',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
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
  name:{
    type:DataTypes.STRING
  },
  description:{
    type:DataTypes.STRING
  },
  type:{
    type:DataTypes.STRING
  },
  material:{
    type:DataTypes.STRING
  },
  status:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'lessons_attachments',
  timestamps:false
})