import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface StudentsLoginsInstance extends Model {
  id: string;
  date: string;
  hour: string;
  student_id: string;
  action:string;
}

export const StudentsLogins = sequelize.define<StudentsLoginsInstance>("StudentsLogins",{
  id:{
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  date:{
    type: DataTypes.DATE
  },
  hour:{
    type: DataTypes.TIME
  },
  student_id:{
    type: DataTypes.INTEGER
  },
  action:{
    type: DataTypes.STRING
  }
},
{
  tableName:"students_logins",
  timestamps:false
})