import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface CoursesModulesInstance extends Model{
  id:number;
  course_id:number;
  image:number;
  type_module:string;
  module:string;
  description:string;
  order:number;
  visibility:number;
  status:number;
}

export const CoursesModules = sequelize.define<CoursesModulesInstance>('CoursesModules',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  course_id:{
    type:DataTypes.INTEGER,
  },
  image:{
    type:DataTypes.INTEGER
  },
  type_module:{
    type:DataTypes.STRING
  },  
  module:{
    type:DataTypes.STRING
  },
  description:{
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
  tableName: 'courses_modules',
  timestamps:false
})