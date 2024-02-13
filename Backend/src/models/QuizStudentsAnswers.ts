import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface QuizStudentsAnswersInstance extends Model{
  id:number;
  student_id:number;
  quiz_id:number;
  question_id:number;
  option_id:number;
  answer:string;
  correct_answer:number;
}

export const QuizStudentsAnswers = sequelize.define<QuizStudentsAnswersInstance>('QuizStudentsAnswers',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  quiz_id:{
    type:DataTypes.INTEGER
  },
  question_id:{
    type:DataTypes.INTEGER
  },
  option_id:{
    type:DataTypes.INTEGER
  },
  answer:{
    type:DataTypes.STRING
  },
  correct_answer:{
    type:DataTypes.TINYINT,
  }
},{
  tableName: 'quiz_student_answers',
  timestamps:false
})