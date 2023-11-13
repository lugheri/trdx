import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface BulkActionStudentsInstance extends Model{
  id:number;
  student_id:number;
  user_id:number;
}

export const BulkActionStudents = sequelize.define<BulkActionStudentsInstance>("BulkActionStudents",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  user_id:{
    type:DataTypes.INTEGER
  },
},{
  tableName:"bulkaction_students",
  timestamps:false
})