import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface QuizStudentsGradeInstance extends Model{
  id:number;
  quiz_id:number;
  student_id:number;
  date:string;
  grade:number;
  completed:number;
}

export const QuizStudentsGrade = sequelize.define<QuizStudentsGradeInstance>('QuizStudentsGrade',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  quiz_id:{
    type:DataTypes.INTEGER
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  grade:{
    type:DataTypes.DECIMAL
  },
  completed:{
    type:DataTypes.TINYINT,
  }
},{
  tableName: 'quiz_students_grade',
  timestamps:false
})