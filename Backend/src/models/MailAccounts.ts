import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface MailAccountsInstance extends Model {
  id:number;
  date:string;
  name:string;
  host:string;
  port:number;
  secure:number;
  user:string;
  pass:string;
  status:number;
}

export const MailAccounts = sequelize.define<MailAccountsInstance>('MailAccounts',{
  id:{
    primaryKey:true,
    autoIncrement:true,
    type:DataTypes.INTEGER
  },
  date:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
  },
  name:{
    type:DataTypes.STRING
  },
  host:{
    type:DataTypes.STRING
  },
  port:{
    type:DataTypes.INTEGER
  },
  secure:{
    type:DataTypes.INTEGER
  },
  user:{
    type:DataTypes.STRING
  },
  pass:{
    type:DataTypes.INTEGER
  },
  status:{
    type:DataTypes.INTEGER
  }  
},{
  tableName:"mail_accounts",
  timestamps:false
})