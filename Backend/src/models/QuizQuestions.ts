import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface QuizQuestionInstance extends Model{
  id:number;
  quiz_id:number;
  type_question:string;
  question:string;
  order:number;
  question_grade:number;
  public:number;
  status:number;
}

export const QuizQuestion = sequelize.define<QuizQuestionInstance>('QuizQuestion',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  quiz_id:{
    type:DataTypes.INTEGER
  },
  type_question:{
    type:DataTypes.STRING
  },
  question:{
    type:DataTypes.STRING
  },
  order:{
    type:DataTypes.INTEGER
  },
  question_grade:{
    type:DataTypes.DECIMAL
  },
  public:{
    type:DataTypes.TINYINT,
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName: 'quiz_questions',
  timestamps:false
})