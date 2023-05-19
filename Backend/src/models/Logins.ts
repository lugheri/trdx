import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface LoginsInstance extends Model {
  id: string;
  date: string;
  hour: string;
  user_id: string;
  action:string;
}

export const Logins = sequelize.define<LoginsInstance>("Logins",{
  id:{
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  date:{
    type: DataTypes.DATE
  },
  hour:{
    type: DataTypes.TIME
  },
  user_id:{
    type: DataTypes.INTEGER
  },
  action:{
    type: DataTypes.TINYINT
  }
},
{
  tableName:"logins",
  timestamps:false
})