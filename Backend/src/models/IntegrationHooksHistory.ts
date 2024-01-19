import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface IntegrationHooksHistoryInstance extends Model{
  id:number;
  date:string;
  product_id:number;
  product_name:string;
  offer:string;
  pay_status:string;
  student_name:string;
  student_mail:string;
  data_post:string;
}

export const IntegrationHooksHistory = sequelize.define<IntegrationHooksHistoryInstance>(
  'IntegrationHooksHistory',{
    id:{
      primaryKey:true,
      autoIncrement:true,
      type:DataTypes.INTEGER
    },
    date:{
      type:DataTypes.DATE,
      defaultValue:DataTypes.NOW
    },
    integration:{
      type:DataTypes.STRING
    },
    product_id:{
      type:DataTypes.INTEGER
    },
    product_name:{
      type:DataTypes.STRING
    },
    offer:{
      type:DataTypes.STRING
    },
    pay_status:{
      type:DataTypes.STRING
    },
    student_name:{
      type:DataTypes.STRING
    },
    student_mail:{
      type:DataTypes.STRING
    },
    data_post:{
      type:DataTypes.STRING
    }
  },{
    tableName:'integration_hooks_history',
    timestamps:false
  }
)