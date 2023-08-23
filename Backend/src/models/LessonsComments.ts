import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';
import { LessonsCommentsLikes } from './LessonsCommentsLikes';
import { Students } from './Students';

export interface LessonsCommentsInstance extends Model{
  id:number;
  date_created:string;
  lesson_id:number;
  student_id:number;
  teacher_id:number;
  answers_comment_id:number;
  comment:string;
  public:number;
  status:number;
}

export const LessonsComments = sequelize.define<LessonsCommentsInstance>('LessonsComment',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  date_created:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  lesson_id:{
    type:DataTypes.INTEGER
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  teacher_id:{
    type:DataTypes.INTEGER
  },
  answers_comment_id:{
    type:DataTypes.INTEGER
  },
  comment:{
    type:DataTypes.STRING
  },
  public:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.INTEGER
  }
},{
  tableName: 'lessons_comments',
  timestamps:false
})
LessonsComments.belongsTo(LessonsCommentsLikes, { foreignKey: 'id', targetKey: 'comment_id'});
LessonsComments.belongsTo(Students, {foreignKey:'student_id', targetKey: 'id'})