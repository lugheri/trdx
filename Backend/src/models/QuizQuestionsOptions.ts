import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface QuizQuestionOptionsInstance extends Model{
  id:number;
  question_id:number;
  answer:string;
  correct_answer:number;
  order:number;
  status:number;
}

export const QuizQuestionOptions = sequelize.define<QuizQuestionOptionsInstance>('QuizQuestionOptions',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  question_id:{
    type:DataTypes.INTEGER
  },
  answer:{
    type:DataTypes.STRING
  },
  correct_answer:{
    type:DataTypes.INTEGER
  },
  order:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName: 'quiz_question_options',
  timestamps:false
})