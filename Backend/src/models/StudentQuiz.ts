import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface StudentsQuizInstance extends Model{
  id:number;
  student_id:number;
  quiz_id:number;
  date:string;
  grade_average:number;
}

export const StudentsQuiz = sequelize.define<StudentsQuizInstance>("StudentsQuiz",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  quiz_id:{
    type:DataTypes.INTEGER
  },
  date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  grade_average:{
    type:DataTypes.INTEGER
  }
},{
  tableName:"students_quiz",
  timestamps:false
})