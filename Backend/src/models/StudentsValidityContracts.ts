import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface StudentsValidityContractsInstance extends Model{
  id:number; 
  student_id:number; 
  payment_cycle:string,
  expired_in:string,
  status:number;
}

export const StudentsValidityContractsInstance = sequelize.define<StudentsValidityContractsInstance>("StudentsValidityContracts",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  }, 
  student_id:{
    type:DataTypes.TINYINT
  },
  payment_cycle:{
    type:DataTypes.STRING
  },
  expired_in:{
    type:DataTypes.DATE
  },
  status:{
    type:DataTypes.TINYINT,
    defaultValue:1
  }
},{
  tableName:"students_validity_contracts",
  timestamps:false
})