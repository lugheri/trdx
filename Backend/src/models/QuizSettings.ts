import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface QuizSettingsInstance extends Model{
  id:number;
  quiz_id:number;
  home_title_1:string;
  home_title_2:string;
  home_text:string;
  reproved_title_1:string;
  reproved_title_2:string;
  reproved_text:string;
  approved_title_1:string;
  approved_title_2:string;
  approved_text:string;
  hours_retry_on_fail:number;
  show_modules:number;
  passing_threshold:number;
}

export const QuizSettings = sequelize.define<QuizSettingsInstance>('QuizSettingsInstance',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  quiz_id:{
    type:DataTypes.INTEGER
  },
  home_title_1:{
    type:DataTypes.STRING
  },  
  home_title_2:{
    type:DataTypes.STRING
  },
  home_text:{
    type:DataTypes.STRING
  },
  reproved_title_1:{
    type:DataTypes.STRING
  },  
  reproved_title_2:{
    type:DataTypes.STRING
  },
  reproved_text:{
    type:DataTypes.STRING
  },
  approved_title_1:{
    type:DataTypes.STRING
  },  
  approved_title_2:{
    type:DataTypes.STRING
  },
  approved_text:{
    type:DataTypes.STRING
  },
  hours_retry_on_fail:{
    type:DataTypes.INTEGER
  },
  show_modules:{
    type:DataTypes.TINYINT
  },
  passing_threshold:{
    type:DataTypes.INTEGER,
  }
},{
  tableName: 'quiz_settings',
  timestamps:false
})