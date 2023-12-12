import { Model, DataTypes} from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface LessonAccessRuleInstance extends Model{
  id:number;
  lesson_id:number;
  rule_access:string;
  days_to_access:number;
  date_of_access:string;
}

export const LessonAccessRules = sequelize.define<LessonAccessRuleInstance>("LessonAccessRules",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
  },
  lesson_id:{
    type:DataTypes.INTEGER
  },
  rule_access:{
    type:DataTypes.STRING
  },
  days_to_access:{
    type:DataTypes.INTEGER
  },
  date_of_access:{
    type:DataTypes.DATE
  }
},{
  tableName:"lesson_access_rules",
  timestamps:false
})