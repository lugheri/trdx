import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface LessonsCommentsLikesInstance extends Model{
  id:number;
  comment_id:number;
  student_id:number;
}

export const LessonsCommentsLikes = sequelize.define<LessonsCommentsLikesInstance>('LessonsCommentsLikes',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  comment_id:{
    type:DataTypes.INTEGER,
  },
  student_id:{
    type:DataTypes.INTEGER,
  }
},{
  tableName: 'lessons_comments_likes',
  timestamps:false
})