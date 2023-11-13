import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface AcceptedTermsOfUseInstance extends Model{
  id:number;
  student_id:number;
  accepted_date:string;
}

export const AcceptedTermsOfUse = sequelize.define<AcceptedTermsOfUseInstance>("AcceptedTermsOfUse",{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  student_id:{
    type:DataTypes.INTEGER
  },
  date_created:{
    type:DataTypes.DATE
  },
},{
  tableName:"accepted_terms_of_use_instance",
  timestamps:false
})