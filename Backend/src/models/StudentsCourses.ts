import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';


export interface StudentsCoursesInstance extends Model{
  id:number;
  date_created:string;
  date_validity:string;
  payment_cycle:string;
  student_id:number;
  course_id:number;
  concluded:number;
  status:number;
}

export const StudentsCourses = sequelize.define<StudentsCoursesInstance>("StudentsCourses",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW,
  },
  date_validity:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW,
  },
  payment_cycle:{
    type:DataTypes.STRING
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  course_id:{
    type:DataTypes.INTEGER
  },
  concluded:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName:"students_courses",
  timestamps:false
})
